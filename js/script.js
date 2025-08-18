// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initSmoothScrolling();
    initStoryPlayers();
    initModalControls();
    initAnimations();
});

// 平滑滚动导航
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 绘本播放器功能
function initStoryPlayers() {
    const storyCards = document.querySelectorAll('.story-card');
    const modal = document.getElementById('audio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCover = document.getElementById('modal-cover');
    const modalDescription = document.getElementById('modal-description');
    
    // 故事数据
    const storyData = {
        emotion: {
            title: '🐻 小熊的情绪世界',
            cover: 'images/emotion_book_cover.png',
            description: '一个温馨的故事，帮助小朋友认识和表达自己的情绪。小熊和朋友们会教你如何处理开心、悲伤、愤怒和惊喜等各种情绪，让你成为情绪小管家！',
            duration: '3:45'
        },
        cognitive: {
            title: '🔢 奇妙的数字王国',
            cover: 'images/cognitive_book_cover.png',
            description: '跟随小探险家们进入神奇的数字王国，在这里你会遇到调皮的数字朋友们，学会数数、认识图形，还能解决有趣的数学谜题。学习原来可以这么有趣！',
            duration: '4:12'
        },
        adventure: {
            title: '🌲 勇敢小探险家',
            cover: 'images/adventure_book_cover.png',
            description: '勇敢的小朋友们踏上了森林探险之旅，在路上他们会遇到各种挑战，结识新朋友，学会勇敢、友爱和坚持。每一步都充满惊喜和成长！',
            duration: '5:20'
        }
    };
    
    storyCards.forEach(card => {
        card.addEventListener('click', function() {
            const storyType = this.dataset.story;
            const story = storyData[storyType];
            
            if (story) {
                openStoryModal(story);
            }
        });
    });
}

// 打开故事播放模态框
function openStoryModal(story) {
    const modal = document.getElementById('audio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCover = document.getElementById('modal-cover');
    const modalDescription = document.getElementById('modal-description');
    const totalTimeDisplay = document.querySelector('.total-time');
    
    modalTitle.textContent = story.title;
    modalCover.src = story.cover;
    modalCover.alt = story.title;
    modalDescription.textContent = story.description;
    totalTimeDisplay.textContent = story.duration;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 开始模拟播放
    startPlayback();
}

// 模态框控制功能
function initModalControls() {
    const modal = document.getElementById('audio-modal');
    const closeBtn = document.getElementById('close-modal');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    // 关闭模态框
    closeBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // 播放/暂停按钮
    playPauseBtn.addEventListener('click', function() {
        if (this.textContent === '⏸️') {
            pausePlayback();
            this.textContent = '▶️';
        } else {
            resumePlayback();
            this.textContent = '⏸️';
        }
    });
    
    // 停止按钮
    stopBtn.addEventListener('click', function() {
        stopPlayback();
        playPauseBtn.textContent = '▶️';
    });
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('audio-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复背景滚动
    stopPlayback();
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    playPauseBtn.textContent = '▶️';
}

// 播放控制变量
let playbackTimer = null;
let currentTime = 0;
let isPlaying = false;
let totalDuration = 225; // 3:45 = 225秒

// 开始播放
function startPlayback() {
    currentTime = 0;
    isPlaying = true;
    updateProgressBar();
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    playPauseBtn.textContent = '⏸️';
    
    playbackTimer = setInterval(() => {
        if (isPlaying) {
            currentTime++;
            updateProgressBar();
            updateTimeDisplay();
            
            // 模拟播放结束
            if (currentTime >= totalDuration) {
                stopPlayback();
                playPauseBtn.textContent = '▶️';
            }
        }
    }, 1000);
}

// 暂停播放
function pausePlayback() {
    isPlaying = false;
}

// 恢复播放
function resumePlayback() {
    isPlaying = true;
}

// 停止播放
function stopPlayback() {
    isPlaying = false;
    currentTime = 0;
    
    if (playbackTimer) {
        clearInterval(playbackTimer);
        playbackTimer = null;
    }
    
    updateProgressBar();
    updateTimeDisplay();
}

// 更新进度条
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const percentage = (currentTime / totalDuration) * 100;
    progressFill.style.width = `${percentage}%`;
}

// 更新时间显示
function updateTimeDisplay() {
    const currentTimeDisplay = document.querySelector('.current-time');
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 初始化动画效果
function initAnimations() {
    // 滚动时显示动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .story-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 添加鼠标跟随效果（可选的温馨效果）
document.addEventListener('mousemove', function(e) {
    createFloatingIcon(e.pageX, e.pageY);
});

function createFloatingIcon(x, y) {
    // 随机选择图标
    const icons = ['✨', '⭐', '💫', '🌟'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    // 创建浮动元素
    const floatingElement = document.createElement('div');
    floatingElement.textContent = randomIcon;
    floatingElement.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        font-size: 16px;
        opacity: 0.7;
        animation: floatUp 2s ease-out forwards;
    `;
    
    document.body.appendChild(floatingElement);
    
    // 2秒后移除元素
    setTimeout(() => {
        floatingElement.remove();
    }, 2000);
}

// 添加浮动动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.9;
        }
        100% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('audio-modal');
    
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case ' ':
            case 'k':
                e.preventDefault();
                const playPauseBtn = document.getElementById('play-pause-btn');
                playPauseBtn.click();
                break;
            case 's':
                e.preventDefault();
                const stopBtn = document.getElementById('stop-btn');
                stopBtn.click();
                break;
        }
    }
});

// 添加触摸设备支持
document.addEventListener('touchstart', function(e) {
    // 处理触摸事件
    const touch = e.touches[0];
    if (touch) {
        // 在触摸位置创建小星星效果
        createTouchEffect(touch.pageX, touch.pageY);
    }
});

function createTouchEffect(x, y) {
    const effect = document.createElement('div');
    effect.textContent = '✨';
    effect.style.cssText = `
        position: fixed;
        left: ${x - 10}px;
        top: ${y - 10}px;
        pointer-events: none;
        z-index: 9999;
        font-size: 20px;
        animation: touchSparkle 1s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// 添加触摸效果动画
const touchStyle = document.createElement('style');
touchStyle.textContent = `
    @keyframes touchSparkle {
        0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0.3) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(touchStyle);

// 页面加载完成后的欢迎效果
window.addEventListener('load', function() {
    // 创建欢迎动画
    setTimeout(() => {
        showWelcomeMessage();
    }, 1000);
});

function showWelcomeMessage() {
    const welcome = document.createElement('div');
    welcome.innerHTML = '🎉 欢迎来到AI绘本故事世界！';
    welcome.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFB6C1, #FF7F7F);
        color: white;
        padding: 20px 30px;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 8px 30px rgba(255, 182, 193, 0.4);
        animation: welcomeBounce 3s ease-out forwards;
    `;
    
    document.body.appendChild(welcome);
    
    setTimeout(() => {
        welcome.remove();
    }, 3000);
}

// 欢迎动画
const welcomeStyle = document.createElement('style');
welcomeStyle.textContent = `
    @keyframes welcomeBounce {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        40% {
            transform: translate(-50%, -50%) scale(0.95);
        }
        60% {
            transform: translate(-50%, -50%) scale(1.05);
        }
        80% {
            transform: translate(-50%, -50%) scale(0.98);
        }
        90% {
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(welcomeStyle);