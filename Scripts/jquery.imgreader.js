/**
 * Created by admin3 on 2016/9/19 0019.
 */

(function($){
    var imgReader = function($source,fileName,success) {
        var $fileInput = $('<input name="' + fileName + '" type="file" style="display:none;" />');
        $source.after($fileInput).click(function(){
            $fileInput.click();
        });
        $fileInput.change(function(){
            var that = this;
            if(this.files && this.files[0]){
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (typeof success === 'function')
                        success.call($source.get(0), e.target.result, that.files[0]);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    $.fn.imgReader = function(opts){
      $(this).each(function(){
            opts.fileName = $(this).data('filename') || opts.fileName;
            imgReader($(this),opts.fileName,opts.success);
      });
    };
    $.fn.imgReader.defaults = {
        fileName: '',
        success: function (imgUrl,file) { }
    }
})($);
