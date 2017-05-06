

//页面标题
const title = '菜谱列表'

//新建页面标题
const creatTitle = '新建菜谱'

//编辑页面标题
const editTitle = '编辑菜谱'



//Modal输入框设置
const inputConfig = [
	{
		label: '菜谱名称(中文)',        //标题  table中的title
		key: 'chinese_title',             //table中的key
		isAble: true,            //是否为必选项
		type: 'text',            //输入框类型  text  textarea
		message: '请输入内容'      //错误信息 当isAble为true时填写此项
	},
	{
		label: '菜谱名称(德语)',
		key: 'germany_title',
		isAble: true,
		type: 'text'
	},
	{
		label: '菜谱描述(中文)',        //标题  table中的title
		key: 'chinese_description',             //table中的key
		isAble: true,            //是否为必选项
		type: 'text',            //输入框类型  text  textarea
		message: '请输入内容'      //错误信息 当isAble为true时填写此项
	},
	{
		label: '菜谱描述(德语)',
		key: 'germany_description',
		isAble: true,
		type: 'text'
	},
		{
		label: '贴士(中文)',
		key: 'chinese_notice',
		isAble: false,
		type: 'text'
	},
	{
		label: '贴士(德语)',
		key: 'germany_notice',
		isAble: false,
		type: 'text'
	},


]

const inputConfig_step = [
	{
		label: '描述',
		key: 'chinese_description',
		isAble: false,
		type: 'textarea'
	},

]

const inputConfig_ingredients = [
	{
		label: '用量',
		key: 'num',
		isAble: false,
		type: 'text'
	},
]

const upLoadConfig = [
	{
		label: '封面图片',
		key: 'image'
	}
]




export {
	title, creatTitle, editTitle, inputConfig, upLoadConfig,
	inputConfig_step, inputConfig_ingredients,
}