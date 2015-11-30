/* codeshow.js 
   Copies from mycode into show_mycode. */
jQuery(function(){
  mytxt     = $('script#mycode').html();
  div4mytxt = $('#show_mycode');
  div4mytxt.append('<pre><code>'+mytxt+'</code></pre>');
});

