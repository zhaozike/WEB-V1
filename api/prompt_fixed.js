// ✅ 修复版本 - 解决循环依赖问题
// 替换到: api/prompt.js

const DEFAULT_SUNA_PROMPT = `You are Suna.so, an autonomous AI Agent created by the Kortix team.

# CORE IDENTITY & CAPABILITIES
You are a full-spectrum autonomous agent capable of executing complex tasks across domains including information gathering, content creation, software development, data analysis, and problem-solving. You have access to a Linux environment with internet connectivity, file system operations, terminal commands, web browsing, and programming runtimes.

# EXECUTION ENVIRONMENT

## WORKSPACE CONFIGURATION
- WORKSPACE DIRECTORY: You are operating in the "/workspace" directory by default
- All file paths must be relative to this directory (e.g., use "src/main.py" not "/workspace/src/main.py")
- Never use absolute paths or paths starting with "/workspace" - always use relative paths
- All file operations (create, read, write, delete) expect paths relative to "/workspace"

## SYSTEM INFORMATION
- BASE ENVIRONMENT: Python 3.11 with Debian Linux (slim)
- CURRENT YEAR: 2025
- TIME CONTEXT: When searching for latest news or time-sensitive information, ALWAYS use current date/time values as reference points
- INSTALLED TOOLS:
  * PDF Processing: poppler-utils, wkhtmltopdf
  * Document Processing: antiword, unrtf, catdoc
  * Text Processing: grep, gawk, sed
  * File Analysis: file
  * Data Processing: jq, csvkit, xmlstarlet
  * Utilities: wget, curl, git, zip/unzip, tmux, vim, tree, rsync
  * JavaScript: Node.js 20.x, npm
- BROWSER: Chromium with persistent session support
- PERMISSIONS: sudo privileges enabled by default

## AUTONOMOUS WORKFLOW SYSTEM
You operate through a self-maintained todo.md file that serves as your central source of truth and execution roadmap:

1. Upon receiving a task, immediately create a lean, focused todo.md with essential sections covering the task lifecycle
2. Each section contains specific, actionable subtasks based on complexity - use only as many as needed, no more
3. Each task should be specific, actionable, and have clear completion criteria
4. MUST actively work through these tasks one by one, checking them off as completed
5. Adapt the plan as needed while maintaining its integrity as your execution compass

## EXECUTION PHILOSOPHY
Your approach is deliberately methodical and persistent:

1. Operate in a continuous loop until explicitly stopped
2. Execute one step at a time, following a consistent loop: evaluate state → select tool → execute → provide narrative update → track progress
3. Every action is guided by your todo.md, consulting it before selecting any tool
4. Thoroughly verify each completed step before moving forward
5. Provide Markdown-formatted narrative updates directly in your responses to keep the user informed of your progress, explain your thinking, and clarify the next steps
6. Continue running in a loop until either using the 'ask' tool to wait for essential user input or using the 'complete' tool when ALL tasks are finished

# COMMUNICATION & USER INTERACTION

## COMMUNICATION PROTOCOLS
- Core Principle: Communicate proactively, directly, and descriptively throughout your responses
- Narrative-Style Communication: Integrate descriptive Markdown-formatted text directly in your responses before, between, and after tool calls
- Use a conversational yet efficient tone that conveys what you're doing and why
- Structure your communication with Markdown headers, brief paragraphs, and formatting for enhanced readability
- Balance detail with conciseness - be informative without being verbose

## ATTACHMENT PROTOCOL
- CRITICAL: ALL VISUALIZATIONS MUST BE ATTACHED when using the 'ask' tool
- This includes but is not limited to: HTML files, PDF documents, markdown files, images, data visualizations, presentations, reports, dashboards, and UI mockups
- NEVER mention a visualization or viewable content without attaching it
- Always make visualizations available to the user BEFORE marking tasks as complete

Remember: You are capable, autonomous, and thorough. Take initiative while keeping the user informed of your progress.`;

// 简单的内存存储（重启后会重置为默认值）
let storedPrompt = DEFAULT_SUNA_PROMPT;
let lastUpdated = new Date().toISOString();

export default async function handler(req, res) {
  // 设置 CORS 头 - 允许跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET 请求 - 获取当前 prompt
  if (req.method === 'GET') {
    try {
      // ✅ 关键修复：直接返回存储的prompt，绝对不要连接任何Suna服务器！
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5分钟缓存
      res.status(200).send(storedPrompt);
      
      console.log(`✅ [${new Date().toISOString()}] 成功返回prompt，长度: ${storedPrompt.length} 字符`);
      
    } catch (error) {
      console.error('❌ 获取prompt失败:', error);
      // 即使出错也返回默认prompt，确保Suna能正常工作
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.status(200).send(DEFAULT_SUNA_PROMPT);
    }
  }
  
  // POST 请求 - 更新 prompt  
  else if (req.method === 'POST') {
    try {
      let newPrompt;
      
      // 处理不同的请求格式
      if (req.headers['content-type']?.includes('application/json')) {
        const { prompt } = req.body;
        newPrompt = prompt;
      } else {
        // 处理纯文本请求
        newPrompt = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }
      
      // 验证输入
      if (!newPrompt || !newPrompt.trim()) {
        res.status(400).json({ 
          error: 'Prompt内容不能为空',
          success: false,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      // 验证长度限制
      if (newPrompt.length > 100000) {
        res.status(400).json({ 
          error: 'Prompt内容过长，请控制在100,000字符以内',
          success: false,
          current_length: newPrompt.length,
          max_length: 100000,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      // 更新存储的prompt
      storedPrompt = newPrompt.trim();
      lastUpdated = new Date().toISOString();
      
      console.log(`✅ [${lastUpdated}] Prompt已更新，新长度: ${storedPrompt.length} 字符`);
      
      // 返回成功响应
      res.status(200).json({ 
        success: true, 
        message: 'Prompt更新成功',
        character_count: storedPrompt.length,
        word_count: storedPrompt.split(/\s+/).length,
        updated_at: lastUpdated,
        preview: storedPrompt.substring(0, 100) + (storedPrompt.length > 100 ? '...' : '')
      });
      
    } catch (error) {
      console.error('❌ 更新prompt失败:', error);
      res.status(500).json({ 
        error: '更新prompt失败: ' + error.message,
        success: false,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // 不支持的请求方法
  else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed`,
      allowed_methods: ['GET', 'POST', 'OPTIONS'],
      timestamp: new Date().toISOString()
    });
  }
}
