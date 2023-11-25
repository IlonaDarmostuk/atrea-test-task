export const Mixin = {
    data() {
      return {
        globalVar: 'Global Variable from Mixin'
      };
    },
    methods: {
      showMessage() {
        console.log('Message from Mixin');
      }
    }
  };