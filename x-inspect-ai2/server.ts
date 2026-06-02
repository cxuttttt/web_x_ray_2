/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_SCANS, INITIAL_REPORTS } from './src/data';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up high limits for base64 images uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // In-memory data persistence
  let scansStore = [...INITIAL_SCANS];
  let reportsStore = [...INITIAL_REPORTS];

  // API Endpoints
  app.get('/api/scans', (req, res) => {
    res.json(scansStore);
  });

  app.post('/api/scans', (req, res) => {
    const newScan = req.body;
    if (!newScan.id || !newScan.imageUrl) {
      return res.status(400).json({ error: 'Missing required scan parameters (id, imageUrl)' });
    }
    // Check duplication
    const exists = scansStore.some(s => s.id === newScan.id);
    if (!exists) {
      scansStore.unshift(newScan);
    }
    res.json({ success: true, scan: newScan });
  });

  app.get('/api/reports', (req, res) => {
    res.json(reportsStore);
  });

  app.post('/api/reports', (req, res) => {
    const newReport = req.body;
    if (!newReport.id || !newReport.name) {
      return res.status(400).json({ error: 'Missing required report parameters' });
    }
    reportsStore.unshift(newReport);
    res.json({ success: true, report: newReport });
  });

  // AI-Powered Gemini Detection Endpoint
  app.post('/api/ai-detect', async (req, res) => {
    const { imageBase64, mimeType, partId, partName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing image data (imageBase64)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured or uses placeholder. Falling back to local offline mode.');
      return res.status(200).json({
        isOfflineFallback: true,
        hasDefect: true,
        defectType: '气孔 (Porosity)',
        confidence: 94.6,
        bboxes: [
          {
            name: '气孔缺陷 A区',
            top: '38%',
            left: '44%',
            width: '12%',
            height: '9%',
            description: '微型焊接气泡聚积区，深度达3.5mm。X射线穿透呈现高度多孔介质，建议排除虚焊。',
            defectCode: 'CH-201: 气孔空洞'
          }
        ],
        conclusion: '分析得出该零件极具怀疑度。工件存在微小孔洞/气泡集中带，根据高精局部二值化对比，该处平均截面空洞占比大约26.8%，属于焊接溢出瑕疵。建议核查回流焊接温度。',
        recommendations: [
          '校准温区传感器，防止局部熔炼温度高而导致微孔聚集。',
          '通过调整振头磨合度，微调焊接接触气压系数。'
        ]
      });
    }

    try {
      // Clean target base64 payload
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const type = mimeType || 'image/png';

      // Lazy load Gemini with official safe construction guidelines
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an expert industrial X-ray inspection agent. 
Analyze this industrial component X-ray image (Part ID: ${partId || 'Unknown'}, Part Name: ${partName || 'Unknown'}).
Look for classic industrial component defects:
- "气孔 (Porosity)" (represented by distinct black or grey spots/holes in welded areas)
- "夹杂 (Inclusion)" (unwanted metal particles showing high/low density clusters)
- "裂纹 (Crack)" (thin dark branching lines of structural stress)
- "短路/连锡 (Short Circuit)" (solder bridging neighboring PCB pins)

Return a comprehensive inspection JSON payload matching this responseSchema exactly. Keep descriptions and recommendations in simplified Chinese. Make sure any bounding boxes (bboxes) coordinates represent actual target defects visualized in the X-ray, expressed as relative percentages (e.g. top: "35%", left: "40%"). If there is no defect, output hasDefect: false, defectType: "无缺陷", confidence: 99.0, and empty bboxes array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: type,
            }
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hasDefect: { type: Type.BOOLEAN },
              defectType: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              bboxes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    top: { type: Type.STRING },
                    left: { type: Type.STRING },
                    width: { type: Type.STRING },
                    height: { type: Type.STRING },
                    description: { type: Type.STRING },
                    defectCode: { type: Type.STRING }
                  },
                  required: ['name', 'top', 'left', 'width', 'height', 'description', 'defectCode']
                }
              },
              conclusion: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['hasDefect', 'defectType', 'confidence', 'bboxes', 'conclusion', 'recommendations']
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error('Empty response from model');
      }

      const reportJson = JSON.parse(resultText.trim());
      res.json(reportJson);
    } catch (err: any) {
      console.error('Gemini processing failed:', err);
      res.status(500).json({ error: `AI Diagnostic error: ${err.message || err}` });
    }
  });

  // DeepSeek API Diagnostic proxy endpoint
  app.post('/api/deepseek/analyze', async (req, res) => {
    const { apiKey, reportContent, customPrompt } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: '请在前端输入您的 DeepSeek API Key 才能调用真实的 DeepSeek 接口。' });
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位资深工业无损检测(NDT)高级工程师、冶金学和表面质量质量控制专家。请为这款被X光扫描的工业零件全新撰写一份极其严谨专业的精密无损检测诊断报告。由于系统将直接使用你的撰写文本替换并渲染到检测页面，请严格以纯 JSON 格式直接响应。JSON中必须精确包含 "conclusion"（220-300字的专业学术级无损检测结论字符串，深度结合熔炼、冷却、枝晶析出及热应力等冶金物理成因）和 "recommendations"（包含3个极其具体的冷却速度、气压系数或惰性保护气体等一整套工艺生产改进建议的字符串数组）。切记：只输出标准的纯 JSON 格式，不要返回任何 markdown ```json 格式包裹！'
            },
            {
              role: 'user',
              content: `请为以下待检测零件撰写精密无损检查诊断报告：
              
工件名称: ${reportContent.name} (ID: ${reportContent.id})
生产批次号: ${reportContent.batchId}
当前检测判定状态: ${reportContent.status === 'anomaly' ? '发现焊接缺陷异常并实施产品防线拦截' : '合格通过'}

写作自定义物理特征偏好与补充调控重点: ${customPrompt || '结合大津二值化圆形度数值、冷却结晶收缩动力学以及表面相变参数等高精数学检测原理展开。'}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1800
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP Status ${response.status}`);
      }

      const data = await response.json();
      let analysisText = data.choices?.[0]?.message?.content || '{}';
      
      // Clean up markdown wrappers if the model ignores the instruction
      analysisText = analysisText.trim();
      if (analysisText.startsWith('```')) {
        analysisText = analysisText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      res.json({ success: true, analysis: analysisText });
    } catch (err: any) {
      console.error('DeepSeek integration error:', err);
      res.status(500).json({ error: `DeepSeek 接口调用失败: ${err.message || '网络连接或授信秘钥异常'}` });
    }
  });

  // Serve static assets or use Vite in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
