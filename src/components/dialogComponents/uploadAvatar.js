

$(function () {
    var URL = window.URL || window.webkitURL;
    var $image = $('#image');
    var $rotate = $('#userImg_rotate');
    var $reUpload = $('#userImg_reUpload');
    var $zoomOut = $('#userImg_zoomOut');
    var $zoomIn = $('#userImg_zoomIn');
    var $save = $('#userImg_save');
    var croppable = false;
    var $previews = $('.userImg_preview');
    var options = {
        aspectRatio: 1,
        viewMode: 1,
        built: function () {
            croppable = true;
        },
        build: function (e) {
            var $clone = $(this).clone();
            $clone.css({
                display: 'block',
                width: '100%',
                minWidth: 0,
                minHeight: 0,
                maxWidth: 'none',
                maxHeight: 'none'
            });
            $previews.css({
                width: '100%',
                overflow: 'hidden'
            }).html($clone);
        },
        
    };
    var originalImageURL = '../static/img/user_unSet_image.png';
    var uploadedImageURL;


    // init
    $image.attr('src',originalImageURL).cropper(options);


 

    // save and upload cropped Img
    $save.on('click',function(){
        $('#image').cropper('getCroppedCanvas').toBlob(function (blob) {
            // blob就是图片的二进制文件，至于怎么上传给你们的后端，需要和你们后端进行协商。在这里你就可以上传你的formData给后端了
            console.log('点击确定，上传所截取的图片！', blob);
            
            // var formData = new FormData();
            // formData.append('photoFile', blob);
            // $.ajax(API_URL+'', {
            //     method: "POST",
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     success: function (res) {
            //         alert('头像上传成功！');
            //     },
            //     error: function () {
            //         alert('头像上传失败！');
            //     }
            // });
        });
    })

    // Inport Image
    var $inputImage = $('#inputImage');
    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }

                    uploadedImageURL = URL.createObjectURL(file);
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    alert('请选择图片再上传！')
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
});
