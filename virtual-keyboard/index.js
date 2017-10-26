export default {
  template: `
  <div id="settlement-account-virtual-keyboard">
    <div class="key-container" v-show="isShow">
      <div class="error-down" @click="hideBoard">
        <span></span>
      </div>
      <div class="row">
        <p class="num-item" @click="getValue('1')">1</p>
        <p class="num-item" @click="getValue('2')">2</p>
        <p class="num-item" @click="getValue('3')">3</p>
      </div>
      <div class="row">
        <p class="num-item" @click="getValue('4')">4</p>
        <p class="num-item" @click="getValue('5')">5</p>
        <p class="num-item" @click="getValue('6')">6</p>
      </div>
      <div class="row">
        <p class="num-item" @click="getValue('7')">7</p>
        <p class="num-item" @click="getValue('8')">8</p>
        <p class="num-item" @click="getValue('9')">9</p>
      </div>
      <div class="row">
        <p class="num-item gray" @click="getValue('.')">.</p>
        <p class="num-item" @click="getValue('0')">0</p>
        <div class="delete gray" id="cross" @click="deleteElement()">&#215;</div>
      </div>

      </div>
  </div>

  `,
  props: {
    // refObject: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    // isShowBoard: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  data() {
    return {
      isShow: false,
      refObject: {}
    }
  },
  methods: {
    deleteElement() {
      this.refObject.deleteElement();
    },
    hideBoard() {
      this.isShow = false;
    },
    showKeyBoard(){
      this.isShow = true;
    },
    getValue(val) {
      this.refObject.getValue(val);
    }
  },
  mounted() {
    // var pElements = this.$el.getElementsByClassName('num-item');
    // var elements = Array.prototype.slice.call(pElements);
    // var value = '';
    // elements.forEach((val, index) => {
    //   val.addEventListener('click', function(event) {
    //     this.value = event.currentTarget.innerText;
    //     this.$emit('getInputItem', this.value);
    //   });
    // });
    this.$on('getInputVm', function(obj) {
      this.refObject = obj;
      this.isShow = true;
    });

  }
}