
export function formatDataToTree(data, obj,scope) {
    for (var i = 0; i <= data.length - 1; i++) {
        data[i].children = [];
        //文件夹树
        if(scope&&scope.hasOwnProperty('folder')){
            if (scope.folder && scope.id == data[i].id) {
                data.splice(i, 1);
                i--;
            } else {
                if (!data[i].parentId || (data[i].parentId && data[i].parentId == obj.id)) {
                    obj.children.push(data.splice(i, 1)[0]);
                    i--;
                }
            }
        }else{
            var id1 = data[i].parentId;
            var id2 = obj.id ;
            //var id3 = data[i].id;
            if (id1 == id2) {
                data[i].level = obj.level + 1;
                obj.children.push(data.splice(i, 1)[0]);
                i--;
            }
        }
    }
    obj.children.sort((a, b)=>{
        if (a.hasOwnProperty('OrderNumber') && a.OrderNumber!=null) {
            return a.OrderNumber.split('.')[a.OrderNumber.split('.').length - 1] - b.OrderNumber.split('.')[b.OrderNumber.split('.').length - 1];
        }
    });
    if (data.length) {
        for (var h = 0; h <= obj.children.length - 1; h++) {
            formatDataToTree(data, obj.children[h],scope);
        }
    }
}
export function encryptStr(str){
    let key = CryptoJS.enc.Utf8.parse("qushi*.Yongcun$%#122ljfkDfj8923l");
    let srcs = CryptoJS.enc.Utf8.parse(str);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let encryptedStr=encrypted.ciphertext.toString();
    return encryptedStr;
}
