import autoprefixer from 'autoprefixer';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPxtorem from 'postcss-pxtorem';

export default {
    plugins: [
        autoprefixer({
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8', '> 1%'],
            grid: true,
        }),
        postcssFlexbugsFixes(),
        postcssPxtorem({ // 自适应，px>rem转换
          rootValue: 54, // 1rem的大小
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
        }),
    ],
};
