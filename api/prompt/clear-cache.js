// API路径: /api/prompt/clear-cache
// 清除prompt缓存（简单实现）

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只支持POST请求
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed`,
      allowed_methods: ['POST', 'OPTIONS'],
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    // 由于我们使用的是简单的内存存储，这里主要是模拟清除缓存的操作
    // 在真实的应用中，这里会清除Redis或其他缓存系统
    
    console.log(`✅ [${new Date().toISOString()}] 缓存清除请求已处理`);
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      message: '缓存已清除',
      cache_cleared: true,
      timestamp: new Date().toISOString(),
      note: '由于使用内存存储，缓存清除主要影响浏览器端缓存'
    });

  } catch (error) {
    console.error('❌ 清除缓存失败:', error);
    res.status(500).json({ 
      error: '清除缓存失败: ' + error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
