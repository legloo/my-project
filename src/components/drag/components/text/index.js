
import pc from './index.vue';

const config = {
    name: '文字',
    code: 2,
    cname: 'normalText'
}
const optionsProps = [
    {
        name: '文字内容',
        code: 'content',
        type: 'textarea',
        default: '我是一段文字'
    },
    // {
    //     name: '文字大小',
    //     code: 'fontSize',
    //     type: 'input',
    //     default: 20
    // }
]

export default {
    optionsProps,
    components: {
        pc
    },
    config
}