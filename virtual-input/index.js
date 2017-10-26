export default {
  template: `<div id="settlement-account-virtual-input" @click.stop="readyToInput">
  <div
    class="input-container"
    tabindex="-1"
    @blur.stop="clearCursorFlash($event)"
    >
    <div class="input-area">
      <span class="cursor"></span>
    </div>
    <div class="right-space" @click="moveCursor($event)">
      <span
        v-if="showText"
        class="gray-text"
        v-text="placeholder"></span>
    </div>
  </div>
</div>
`,
  props: {
    value: {
      type: String,
      default: '',
    },
    isAutoFocus: {
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      intervalId: '',
      showText: true,
      inputContainer: {},
      inputArea: {}
    }
  },
  methods: {
    //移动光标位置
    moveCursor(event) {
      let cursor = this.$el.getElementsByClassName('cursor')[0];

      if(event.currentTarget.className == 'right-space'){
        if(!cursor.nextSibling || cursor.nextSibling.nodeName == '#text'){
          return;
        } else {
          let ele = cursor.nextSibling;
          this.inputArea.insertBefore(this.inputArea.lastElementChild, ele);
          this.inputArea.appendChild(cursor);
        }

      }else {
        let tempEle = event.currentTarget.nextSibling;
        // let nodeName = event.currentTarget.nextSibling.nodeName;
        // let cursor = this.$el.getElementsByClassName('cursor')[0];

        if(!tempEle || tempEle.nodeName == '#text') {
          let temp = event.currentTarget.previousSibling;
          let ele = this.inputArea.replaceChild( event.currentTarget, cursor);//把光标替换成当前元素
          this.inputArea.appendChild(ele);

        } else {
          let temp = event.currentTarget.nextSibling;
          let ele = this.inputArea.replaceChild( event.currentTarget, cursor);//把光标替换成当前元素
          this.inputArea.insertBefore(ele, temp);
        }
      }
    },
    //插入元素
    insert(value) {
      let span = document.createElement("span"); //创建包含值的元素
      span.className = 'val';
      span.innerText = value;

      let space = document.createElement("span");
      space.className = 'space';
      space.addEventListener('click', this.moveCursor);

      let cursor = this.$el.getElementsByClassName('cursor')[0];

      this.inputArea.insertBefore(space, cursor);//插入空列
      this.inputArea.insertBefore(span, cursor);//插入值
    },
    //删除元素
    deleteElement() {
      this.setCursorFlash();
      let cursor = this.$el.getElementsByClassName('cursor')[0];
      let n = 2; //两个删除动作
      while(cursor.previousSibling && n > 0) {
        this.inputArea.removeChild(cursor.previousSibling );
        n--;
      }
      // if(cursor.previousSibling) {
      //   this.inputArea.removeChild(cursor.previousSibling );
      // }

      // this.inputArea.removeChild(cursor.previousSibling );
      if(this.getInputStr().search(/^\.\d*/) > -1) {
        this.insert(0);
      }
      this.$emit('input', this.getInputStr());//触发v-model动态变化
    },
    //获取输入框的元素
    getInputStr() {
      let valueEle = this.$el.getElementsByClassName('val');
      let elements = Array.prototype.slice.call(valueEle);
      if (elements.length > 0) {
        let inputStr = '';
        elements.forEach(function (item, index) {
          inputStr += item.innerText;
        });
        return inputStr;
      } else {
        return '';
      }
    },

    //获取光标在小数点之前还是之后
    //1 表示 光标在小数点之后
    // 0 表示没有 小数点或者光标在小数点之前
    isBeforeCursor() {
      let cursor = this.$el.getElementsByClassName('cursor')[0];
      let curTarget1 = cursor;

      while(curTarget1.previousSibling) {
        let ele = curTarget1.previousSibling;
        if (ele.innerText === '.') {
          return 1;
        }
        curTarget1 = ele;
      }
      let curTarget2 = cursor;
      while(curTarget2.nextSibling) {
        let ele = curTarget2.nextSibling;
        if (ele.innerText === '.') {
          return 0;
        }
        curTarget2 = ele;
      }

      return 0;
    },
    readyToInput() {
      this.setCursorFlash(); //光标闪动
      this.showKeyBoard(); //键盘弹出
    },

    //设置光标定时任务
    setCursorFlash() {
      let cursor = this.$el.getElementsByClassName('cursor')[0];
      let inputContainer = this.$el.getElementsByClassName('input-container')[0];
      cursor.className = "cursor";
      let isShowCursor = true;
      inputContainer.focus();//获取焦点
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(function() {
        isShowCursor = !isShowCursor;
        if (isShowCursor) {
          cursor.className = 'cursor';
        } else {
          cursor.className = 'cursor hidden';
        }
      }, 1000);
    },
    // //输入框获取焦点
    // getFocus() {
    // 	let inputContainer = this.$el.getElementsByClassName('input-container')[0]; //获取输入框
    // 	inputContainer.focus();
    // }

    //输入框失去焦点时光标隐藏
    clearCursorFlash(event) {
      let cursor = this.$el.getElementsByClassName('cursor')[0]; //获取光标
      clearInterval(this.intervalId);
      cursor.className = 'cursor hidden';
    },
    getValue(value) {//获取到要输入的值之后，将值放入输入框
      this.setCursorFlash();
      var inputStr = this.getInputStr(); //获取输入框元素
      var isBefore = this.isBeforeCursor();//Boolean值
      let cursor = this.$el.getElementsByClassName('cursor')[0];

      if ((isBefore == 0 || inputStr.search(/\.\d{2}/) == -1) && (value !== '.' || inputStr.search(/\./) == -1)) {
        let str = value + inputStr;
        if (value == '.' && !cursor.previousSibling) {
          this.insert(0);
        }
        this.insert(value);
        this.$emit('input', this.getInputStr());//触发v-model动态变化
      }
    },
    setValue(value) {
      let str = '';
      let items = value.split('');
      items.forEach((item, index)=>{
        str += `<span class="space"></span><span class="val">${item}</span>`;
      });
      str += `<span class="cursor"></span>`;
      this.inputArea.innerHTML = str; //将元素放进去
      //给space设置点击事件
      let spaces = this.inputArea.getElementsByClassName('space');
      Array.prototype.slice.call(spaces).forEach((item, index)=>{
        item.addEventListener('click',this.moveCursor);
      });

    },
    showKeyBoard() {
      this.$emit('show-key-board'); //弹出键盘
    }
  },
  watch: {
    value(val) {
      if(val == ''){
        this.showText = true;
      } else {
        this.showText = false;
      }
    }
  },
  mounted() {
    this.inputArea = this.$el.getElementsByClassName('input-area')[0];

    if(this.value) {
      this.setValue(this.value);
      this.showText = false;
    }
    if (this.isAutoFocus) {
      this.readyToInput();
    } else {
      this.clearCursorFlash();
    }
    // this.inputContainer = this.$el.getElementsByClassName('input-container')[0];
    // this.inputContainer.focus();
  }
}