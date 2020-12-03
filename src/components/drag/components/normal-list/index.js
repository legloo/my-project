
import pc from './index.vue';

const config = {
    name: '列表',
    code: 1,
    cname: 'normalList'
}

const optionsProps = [
    {
        name: '数据源',
        code: 'dataSource',
        type: 'select'
    },
]

export default {
    optionsProps,

    components: {
        pc
    },
    config
}