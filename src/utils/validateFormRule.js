export default {
    methods: {
        //验证表单
        invalidCharacter (rule, value, callback) {
            value = value.trim();
            let pattern = /['|"|<|>|#|%|\\|\/|:|\*|\?|\|]/g;
            let length = value.length;
            if (!length) {
                callback(new Error(this.$t('message.enterNameTip')));
                return;
            }
            if (pattern.test(value)) {
                callback(new Error(this.$t('message.invalidCharacter')));
                return;
            }
            if (length > 200) {
                callback(new Error(this.$t('message.characterLenTip')));
                return;
            }
            callback();
        },
    }
}