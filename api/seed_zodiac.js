// api/seed_zodiac.js

const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/Post');
const User = require('./models/User');

// 12星座数据（包含英文名用于生成图片，中文用于显示）
const zodiacs = [
    { en: 'Aries', cn: '白羊座', dates: '3.21 - 4.19', element: '火象', traits: '热情、自信、冲动' },
    { en: 'Taurus', cn: '金牛座', dates: '4.20 - 5.20', element: '土象', traits: '稳重、可靠、务实' },
    { en: 'Gemini', cn: '双子座', dates: '5.21 - 6.21', element: '风象', traits: '机智、善变、好奇' },
    { en: 'Cancer', cn: '巨蟹座', dates: '6.22 - 7.22', element: '水象', traits: '顾家、敏感、通过' },
    { en: 'Leo', cn: '狮子座', dates: '7.23 - 8.22', element: '火象', traits: '慷慨、自大、领导力' },
    { en: 'Virgo', cn: '处女座', dates: '8.23 - 9.22', element: '土象', traits: '完美主义、挑剔、勤奋' },
    { en: 'Libra', cn: '天秤座', dates: '9.23 - 10.23', element: '风象', traits: '优雅、公正、优柔寡断' },
    { en: 'Scorpio', cn: '天蝎座', dates: '10.24 - 11.22', element: '水象', traits: '神秘、记仇、性感' },
    { en: 'Sagittarius', cn: '射手座', dates: '11.23 - 12.21', element: '火象', traits: '自由、乐观、粗心' },
    { en: 'Capricorn', cn: '摩羯座', dates: '12.22 - 1.19', element: '土象', traits: '严谨、野心、保守' },
    { en: 'Aquarius', cn: '水瓶座', dates: '1.20 - 2.18', element: '风象', traits: '独立、创新、叛逆' },
    { en: 'Pisces', cn: '双鱼座', dates: '2.19 - 3.20', element: '水象', traits: '浪漫、幻想、多情' },
];

const seedDB = async () => {
    try {
        // 1. 连接数据库
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ 数据库连接成功');

        // 2. 找一个“作者” (我们默认用数据库里的第一个用户)
        const author = await User.findOne();
        if (!author) {
            console.log('❌ 数据库里没有用户，请先去注册一个用户再运行脚本！');
            process.exit();
        }
        console.log(`👤 文章将归属于作者: ${author.username}`);

        // 3. 清空旧的星座文章 (可选，防止重复)
        // await Post.deleteMany({ title: { $regex: '座' } });

        // 4. 生成文章数据
        const posts = zodiacs.map(z => {
            return {
                title: `【${z.cn}】${z.dates} 星座运势与性格深度解析`,
                summary: `${z.cn}（${z.en}）是${z.element}星座。关键词：${z.traits}。点击查看2026年完整运势分析...`,
                // 使用 AI 生成的星座插画 URL
                img: `https://image.pollinations.ai/prompt/mysterious%20fantasy%20art%20of%20zodiac%20sign%20${z.en}%20astrology%20ultra%20realistic%20high%20quality?width=1080&height=720&nologo=true&seed=${Math.random()}`,
                content: `
# ${z.cn} (${z.en})

> **元素**：${z.element}  
> **日期**：${z.dates}  
> **关键词**：${z.traits}

## 性格分析
**${z.cn}** 的人通常非常有特点。作为${z.element}星座的代表，他们展示出了惊人的生命力。

* **优点**：他们拥有${z.traits.split('、')[0]}的天性，总是能感染身边的人。
* **缺点**：有时候过于${z.traits.split('、')[1]}，可能会让人觉得难以接近。

## 2026年运势前瞻
对于${z.cn}的朋友们来说，2026年将是**关键的一年**。

1.  **事业**：机会就在眼前，但需要抓住。
2.  **爱情**：桃花运旺盛，但要注意烂桃花。
3.  **财运**：稳步上升。

\`\`\`javascript
// 星座幸运代码
const luck = {
  sign: "${z.en}",
  color: "Lucky Red",
  number: 7
};
console.log("Good Luck!");
\`\`\`

---
        `,
                author: author._id,
            };
        });

        // 5. 插入数据库
        await Post.insertMany(posts);
        console.log(`🎉 成功插入 ${posts.length} 篇星座文章！`);

    } catch (err) {
        console.error(err);
    } finally {
        // 6. 断开连接
        mongoose.connection.close();
    }
};

seedDB();