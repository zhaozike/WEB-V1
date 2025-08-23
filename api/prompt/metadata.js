// API路径: /api/prompt/metadata
// 返回prompt的元数据信息

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只支持GET请求
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed`,
      allowed_methods: ['GET', 'OPTIONS'],
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    // 获取当前prompt内容来计算统计信息
    const response = await fetch(`${req.headers.host ? 'https://' + req.headers.host : 'https://web-v1-one.vercel.app'}/api/prompt`);
    let currentPrompt = '';
    let promptLength = 0;
    let wordCount = 0;
    let lineCount = 0;

    if (response.ok) {
      currentPrompt = await response.text();
      promptLength = currentPrompt.length;
      wordCount = currentPrompt.split(/\s+/).filter(word => word.length > 0).length;
      lineCount = currentPrompt.split('\n').length;
    }

    // 返回元数据
    res.status(200).json({
      success: true,
      metadata: {
        character_count: promptLength,
        word_count: wordCount,
        line_count: lineCount,
        last_updated: new Date().toISOString(),
        version: "1.0.0",
        status: "active",
        source: "vercel_api"
      },
      cache_status: "no_cache", // 简单实现，没有真正的缓存
      history_count: 1,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 获取metadata失败:', error);
    res.status(500).json({ 
      error: '获取元数据失败: ' + error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
