// import Vue from './vue.js';
import vInput from './virtual-input/index.js';
import vKeyboard from './virtual-keyboard/index.js';
let vApp = new Vue({
	el: '#vue-keyboard',
	components: {
			vInput,
			vKeyboard,
	},
	data(){
		return {
			placeText: '请输入金额',
			amount: ''
		}
	},
	methods:{
		showKeyBoard() {
			//键盘弹出的同时，传入输入框对象
      this.$refs.virtualKeyBoard.$emit('getInputVm', this.$refs.virtualInput);
		}
	},
	mounted() {
		//保证子组件实例化完成之后将virtualInput的实例传给virtualKeyBoard
		this.$refs.virtualKeyBoard.$emit('getInputVm', this.$refs.virtualInput);
	}
});