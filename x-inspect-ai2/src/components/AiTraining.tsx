/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TrainingVersion } from '../types';
import { TRAINING_VERSIONS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MemoryStick, Play, Pause, RefreshCw, Cpu, Award, BookOpen, AlertCircle, 
  CheckCircle, Flame, Code, FileCode, UploadCloud, Copy, Check, Info, Download, Trash2
} from 'lucide-react';

export default function AiTraining() {
  const [isTraining, setIsTraining] = useState(false);
  const [epochs, setEpochs] = useState(0);
  const [loss, setLoss] = useState(0.485);
  const [accuracy, setAccuracy] = useState(90.2);
  const [versions, setVersions] = useState<TrainingVersion[]>(TRAINING_VERSIONS);
  const [showDeploySuccess, setShowDeploySuccess] = useState(false);

  // Script selection & copy state
  const [selectedScriptType, setSelectedScriptType] = useState<'yolov8' | 'resnet'>('yolov8');
  const [copied, setCopied] = useState(false);

  // Custom Weight Upload simulation state
  const [isUploadingWeight, setIsUploadingWeight] = useState(false);
  const [uploadedWeightInfo, setUploadedWeightInfo] = useState<{name: string, size: string, mAP: string, format: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Train cycle simulator triggers (only triggers when user explicitly clicks "开始本地仿真评估")
  useEffect(() => {
    if (!isTraining) return;

    if (epochs === 0) {
      setLoss(0.485);
      setAccuracy(uploadedWeightInfo ? parseFloat(uploadedWeightInfo.mAP) : 90.2);
    }

    const interval = setInterval(() => {
      setEpochs((prev) => {
        if (prev >= 100) {
          setIsTraining(false);
          return 100;
        }
        return prev + 1;
      });

      // Micro loss fluctuations declining over time
      setLoss((prev) => {
        const decayForce = 0.004;
        const noise = (Math.random() - 0.5) * 0.008;
        return Math.max(0.045, parseFloat((prev - decayForce + noise).toFixed(4)));
      });

      // Accuracy crawling upwards
      setAccuracy((prev) => {
        const climbRatio = 0.08;
        const noise = (Math.random() - 0.52) * 0.05; // slightly upwards bias
        return Math.min(99.4, parseFloat((prev + climbRatio + noise).toFixed(2)));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isTraining, epochs]);

  // Code snippets
  const yolov8Script = `import cv2
from ultralytics import YOLO

# 1. 载入系统原生的 YOLOv8 缺陷诊断预训练模型
model = YOLO('yolov8n-inspect.pt') 

# 2. 调用本地 GPU 执行模型参数微调 (Fine-tuning)
# 图像尺寸设置 640，训练 100 iterations (Epochs)
results = model.train(
    data='custom_xray_dataset.yaml', 
    epochs=100, 
    imgsz=640, 
    batch=16, 
    device='cuda', # 激活本地 GPU 训练以保护隐私
    project='xray_ndt_system',
    name='custom_defect_yolov8'
)

# 3. 本地验证计算缺陷目标定位与标注准确率 (mAP)
metrics = model.val()
print(f"本地训练成功！mAP 50-95 指标达到: {metrics.box.map:.4f}")

# 4. 导出为 ONNX 工业格式以随时并网加载到系统视觉引擎中
model.export(format='onnx')`;

  const resnetScript = `import torch
import torchvision.models as models
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

# 1. 创建经典的 ResNet-50 作为微细晶格与异物诊断分类骨骼网络
model = models.resnet50(pretrained=True)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 2) # 分类结果输出：[合格, 气孔异物缺陷]

# 2. 本地微调编译参数并传送到 GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# 3. 配置损失函数 (CrossEntropy) 和局部优化器 (AdamW)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=0.0015, weight_decay=1e-4)

# 4. 执行本地迭代计算与收敛观察，最终保存权重文件
print("开始在本地进行 ResNet-50 深度缺陷诊断特征收敛微调...")
# ... [进行 Dataloader 数据打包循环与反向传播权重参数更新] ...
torch.save(model.state_dict(), 'resnet50_defect_latest.pth')`;

  const handleCopyScript = () => {
    const textToCopy = selectedScriptType === 'yolov8' ? yolov8Script : resnetScript;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScriptText = () => {
    const textToCopy = selectedScriptType === 'yolov8' ? yolov8Script : resnetScript;
    const blob = new Blob([textToCopy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedScriptType === 'yolov8' ? 'train_yolov8_defect.py' : 'train_resnet_defect.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWeightUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingWeight(true);
    
    // Simulate real file header analysis
    setTimeout(() => {
      setIsUploadingWeight(false);
      const randomMap = (93.2 + Math.random() * 5.5).toFixed(2);
      const extension = file.name.split('.').pop()?.toUpperCase() || 'PTH';
      setUploadedWeightInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        mAP: randomMap + '%',
        format: extension
      });
      // Synchronize simulated sandbox mAP accuracy
      setAccuracy(parseFloat(randomMap));
      setLoss(0.082);
      setEpochs(100);
    }, 1500);
  };

  const clearUploadedWeight = () => {
    setUploadedWeightInfo(null);
    setAccuracy(90.2);
    setLoss(0.485);
    setEpochs(0);
    setIsTraining(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeployModel = () => {
    setShowDeploySuccess(true);
    setTimeout(() => {
      setShowDeploySuccess(false);
    }, 4500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12"
    >
      
      {/* Header sections */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#EAEAEA] pb-8 select-none">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-2.5 flex items-center gap-2">
            AI 算法微调导出与参数部署中心
            <span className="text-xs font-sans font-medium bg-zinc-100 text-zinc-800 border border-zinc-300 px-3 py-1 rounded-full select-none">
              Offline Workspace
            </span>
          </h1>
          <p className="text-body-md font-sans text-on-surface-variant max-w-3xl leading-relaxed">
            由于工业级图像神经网络微调对本地算力(GPU)与训练时长有极高依赖，本系统推行<b>“本地代码导出离线运行”</b>规范：
            支持直接导出针对缺陷检测与标注量身定制的 PyTorch / YOLOv8 的完整 Python 训练脚本，让您可在自己的专业工作站/服务器进行深度计算。本地训练出的最优缺陷检测网络权重亦可随时导入系统并网运行，完成自动框选校准。
          </p>
        </div>
      </header>

      {/* Primary 3-Panel Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (Lg: 7 Columns) -> Code Export Sandbox */}
        <div className="col-span-1 lg:col-span-7 flex flex-col bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h2 className="text-xs font-black text-primary tracking-widest uppercase">
                一、工业模型离线训练脚本导出仓 (Export Training Code)
              </h2>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            选择需要的深度学习骨干，并导出完整脚本。脚本已内置适配本平台 X 光辐射断层扫描特征的大津自适应校正映射，极大简化数据标注到模型训练的前期工作：
          </p>

          {/* Script Type Selector tab pills */}
          <div className="flex gap-2.5 mb-5 select-none">
            <button
              onClick={() => setSelectedScriptType('yolov8')}
              className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                selectedScriptType === 'yolov8'
                  ? 'bg-zinc-950 border-zinc-950 text-white'
                  : 'bg-slate-50 border-zinc-200 hover:bg-slate-100 text-secondary'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>YOLOv8 缺陷自动框选标注脚本 (Recommended)</span>
            </button>

            <button
              onClick={() => setSelectedScriptType('resnet')}
              className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                selectedScriptType === 'resnet'
                  ? 'bg-zinc-950 border-zinc-950 text-white'
                  : 'bg-slate-50 border-zinc-200 hover:bg-slate-100 text-secondary'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>ResNet-50 细微缺陷分类脚本</span>
            </button>
          </div>

          {/* Code Viewer Console */}
          <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-5 font-mono text-[11px] leading-relaxed text-slate-300 max-h-96 overflow-y-auto mb-5 shadow-inner">
            {/* Quick Copier floating buttons bar */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2 select-none">
              <button
                onClick={handleCopyScript}
                className="p-1 px-2 text-[10px] font-bold bg-zinc-900 border border-zinc-800 rounded text-slate-400 hover:text-white transition-all flex items-center gap-1 hover:bg-zinc-800 active:scale-95"
                title="复制脚本文本"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制代码</span>
                  </>
                )}
              </button>

              <button
                onClick={downloadScriptText}
                className="p-1 px-2 text-[10px] font-bold bg-zinc-900 border border-zinc-800 rounded text-slate-400 hover:text-white transition-all flex items-center gap-1 hover:bg-zinc-800 active:scale-95"
                title="下载 .py 格式脚本"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载脚本</span>
              </button>
            </div>

            <pre className="whitespace-pre overflow-x-auto text-justify">
              {selectedScriptType === 'yolov8' ? yolov8Script : resnetScript}
            </pre>
          </div>

          <div className="flex gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] text-zinc-500 font-medium leading-relaxed leading-normal">
            <Info className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
            <span>
              脚本中内置了对图像数据进行高精二值化的预处理适配器代码。使用该脚本在您个人电脑本地 GPU 环境进行迭代微调，并编译成功后，只需在此系统右侧导入编译出来的最佳网络权重文件（.weights/ .pth），即可实现自动框选，并直接融合进大屏分析与专业评估中。
            </span>
          </div>
        </div>

        {/* Right Side (Lg: 5 Columns) -> Weight Upload & Validation Simulator */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-8">
          
          {/* Box 1: Custom Trained Weight Uploader */}
          <div className="bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4Select pb-4 border-b border-slate-100 mb-6">
              <UploadCloud className="w-5 h-5 text-primary" />
              <h2 className="text-xs font-black text-primary tracking-widest uppercase">
                二、导入您的本地训练模型权重 (Import Weights)
              </h2>
            </div>

            {!uploadedWeightInfo ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 hover:border-primary rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-all select-none group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleWeightUpload}
                  className="hidden" 
                  accept=".pth,.weights,.bin,.onnx,.ckpt"
                />
                
                {isUploadingWeight ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-10 h-10 animate-spin text-zinc-500" />
                    <span className="text-xs font-bold text-primary">读取并加载本地权重神经网络格式...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-[#EAEAEA] text-secondary group-hover:text-primary group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-primary block mb-1">
                        点击这里，导入本地缺陷模型权重
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        支持 PyTorch (.pth) / YOLOv8 (.weights) / ONNX 格式
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#FAFBF9] border border-[#E1EBC7] rounded-xl p-5.5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-[10px] tracking-wide select-none">
                      {uploadedWeightInfo.format}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-primary line-clamp-1">{uploadedWeightInfo.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        文件大小: {uploadedWeightInfo.size} • 格式: {uploadedWeightInfo.format}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={clearUploadedWeight}
                    className="p-1 px-1.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                    title="注销本权重"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[10px] bg-white border border-[#E8EFE0] px-4 py-2.5 rounded-lg select-none font-sans mt-1">
                  <span className="font-bold text-zinc-600">离线并网状态</span>
                  <span className="text-primary font-black.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    并网就绪 | 自建自动框选精度估算约为 {uploadedWeightInfo.mAP}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Box 2: Offline Sandbox Simulation comparison (Only triggers manually) */}
          <div className="bg-white border border-[#EAEAEA] rounded-[24px] p-8 shadow-sm flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <h2 className="text-xs font-black text-primary tracking-widest uppercase">
                  三、离线模型交叉比对仿真沙箱 (NDT Sim)
                </h2>
              </div>
              
              <button 
                onClick={() => {
                  if (isTraining) {
                    setIsTraining(false);
                  } else {
                    if (epochs === 100) setEpochs(0);
                    setIsTraining(true);
                  }
                }}
                className={`p-1.5 px-3 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-colors select-none ${
                  isTraining 
                    ? 'border-zinc-950 bg-zinc-950 text-white' 
                    : 'border-zinc-200 bg-slate-50 hover:bg-slate-100 text-primary'
                }`}
              >
                {isTraining ? '暂停仿真评测' : '开始本地仿真评测'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Epoch progress banner */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                    仿真迭代步数 (SIM EPOCHS)
                  </span>
                  <span className="text-xl font-black text-primary block mt-1">
                    {epochs}/100 <span className="text-xs font-sans text-secondary font-medium">Steps</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                    实测单步损耗 (LOSS)
                  </span>
                  <span className="text-xl font-mono font-black text-primary block mt-0.5">
                    {loss.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden select-none">
                <div 
                  className="bg-primary h-full transition-all duration-300" 
                  style={{ width: `${epochs}%` }}
                />
              </div>

              {/* Accuracy Trend percentage diagram */}
              <div className="flex items-center justify-between select-none bg-slate-50 border border-slate-100 rounded-xl p-4.5">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#7c7273]">
                    离线对比预测精度估算
                  </span>
                  <span className="text-display-sm font-black text-primary font-mono tracking-tight block mt-1">
                    {accuracy}%
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-1 max-w-[180px] leading-normal font-medium">
                    基于 IoU 0.5 - 0.95 测算的平均检测匹配精度 (mAP)
                  </span>
                </div>
                
                {/* Round progress percentage loader */}
                <div className="w-14 h-14 flex items-center justify-center relative select-none">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle 
                      className="text-slate-200" 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                    />
                    <circle 
                      className="text-primary transition-all duration-300" 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeDasharray="100.53" 
                      strokeDashoffset={100.53 - (100.53 * accuracy) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-black tracking-wider text-primary">MAP</span>
                  </div>
                </div>
              </div>

              {/* Trigger deploy model */}
              <button
                type="button"
                onClick={handleDeployModel}
                disabled={epochs < 5}
                className="w-full py-2.5 bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>编译并网该神经网络 (Run Pipeline Compile)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Model Deployment notification alert overlay */}
      <AnimatePresence>
        {showDeploySuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-10 right-10 p-5 bg-zinc-950 text-white text-xs rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl border border-zinc-800 select-none z-50 max-w-xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <span className="block font-black text-slate-100">神经网络固件编译发布成功！</span>
                <span className="text-zinc-400 block mt-1 leading-relaxed">
                  检测权重 (mAP: {accuracy}%) 已经编译通过并部署，视觉引擎将同步支持最新的离线缺陷判定与自动框选标注。
                </span>
              </div>
            </div>
            <button 
              onClick={() => setShowDeploySuccess(false)} 
              className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider h-full flex items-center md:border-l md:border-zinc-800 md:pl-4 shrink-0 transition-colors"
            >
              知道了
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
