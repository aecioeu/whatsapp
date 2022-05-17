function CalltoAction(){
  // var url = $('.whatsapp').attr('data')
  // var redirectWindow = 
  var redirectWindow = window.open('https://google.com', '_blank')
  redirectWindow.location.href = "https://api.whatsapp.com/send?phone=5537998686951&text=Quero saber mais."

}

  /*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b})},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++)if(j[a]&&C[a]===p(a))return;g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];);return a}function r(a){for(;--a>=0&&!j[a];);return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++)if(j[c]){if(!(n>d&&j[c].test(C[d])))break;C[c]=C[d],C[d]=p(d),d=q(d)}z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++)if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e)))break;c=e}}function u(){var a=B.val(),b=B.caret();if(o&&o.length&&o.length>a.length){for(A(!0);b.begin>0&&!j[b.begin-1];)b.begin--;if(0===b.begin)for(;b.begin<l&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else B.caret(e);i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++)j[c]&&(C[c]=p(c))}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++)if(j[b]){for(C[b]=p(b);d++<e.length;)if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break}if(d>e.length){y(b+1,n);break}}else C[b]===e.charAt(d)&&d++,k>b&&(f=b);return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){B.get(0)===document.activeElement&&(z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a))},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});


$(".whatsapp")
            .mask("(99) 9999-9999?9")
            .focusout(function(event) {
                var target, phone, element;
                target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                phone = target.value.replace(/\D/g, '');
                element = $(target);
                element.unmask();
                if (phone.length > 10) {
                    element.mask("(99) 99999-999?9");
                } else {
                    element.mask("(99) 9999-9999?9");
                }
            });

$(".name").trigger("focus")

     const observer = lozad('.lozad', {
        rootMargin: '10px 0px', // syntax similar to that of CSS Margin
        threshold: 0.1, // ratio of element convergence
        enableAutoReload: true // it will reload the new image when validating attributes changes
        });
    observer.observe();
    
    $('form').on('submit', function (e) {
    
    e.preventDefault();

    var name = $(".name").val()
    var whastapp = $(".whatsapp").val()

    console.log(name, whastapp)

    var pass_name = false,
    pass_whats = false


    if (whastapp.length < 9) {
      // checa o whatsapp
      $('.erro-whatts').removeClass('none')
      $(".whastapp").trigger("focus")
      } else {
          $('.erro-whatts').addClass('none')
          pass_whats = true
      }

      if (name.length < 3) {
        $('.erro-name').removeClass('none')
        if (pass_whats)
            $(".name").trigger("focus")
    } else {
        $('.erro-name').addClass('none')
        pass_name = true
    }

    if (pass_name && pass_whats) {

      $.ajax({
        type: 'post',
        url: '/lead',
        data: $('form').serialize(),
        success: function (data) {
             console.log(data)
             $('#formulario').hide().empty().html('<p>Abrindo Whatssapp...</p>')
             $('#formulario').fadeIn() 

             CalltoAction()
         
            }
    });


    }
  
     
    });
    
    function randomIntFromInterval(min, max) { // min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    
    if(localStorage.getItem('avaliable') == null){
        console.log("nao tem")
        localStorage.setItem('avaliable', 85);   
    }else{
        console.log(localStorage.getItem('avaliable'))
    }
    
    $('.avaliable').html(localStorage.getItem('avaliable'))
    
    const countAvaliable = async () => {
          
      var getAvaliable = localStorage.getItem('avaliable');
    
      //console.log(`Vagas Restantes ${parseFloat(getAvaliable)}`)
        
        if(parseFloat(getAvaliable) < 10){
            $(".monitoring").addClass("red").addClass("pulsate");
            setInterval(() => {
              $('.btn-purple').addClass("shake") 
            }, 5000);
        }
      
        if(parseFloat(getAvaliable) <= 2){
               // console.log("parando o contador")
                $('.avaliable').html("1")
                $('.monitoring').empty().html("👋 <strong>Apenas 1 vaga restante ...</strong>")
              
                
      }else{
        
        const randomAvaliable = randomIntFromInterval(4000, 10000)
        const rndInt = randomIntFromInterval(1, 3)
    
       var remain = parseFloat(getAvaliable) - rndInt
       $('.avaliable').html(remain)
       localStorage.setItem('avaliable', remain);
       
      await sleep(500)
     
        console.log(randomAvaliable)
        await sleep(randomAvaliable);
        
       countAvaliable();
      }
      
    
    
    
    }
    
    countAvaliable();
          
    
    
function time_ago(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "segundos", 1], // 60
      [120, "1 munuto atrás", "1 minute from now"], // 60*2
      [3600, "minutos", 60], // 60*60, 60
      [7200, "1 hora atrás", "1 hour from now"], // 60*60*2
      [86400, "horas", 3600], // 60*60*24, 60*60
      [172800, "Ontem", "Amanhã"], // 60*60*24*2
      [604800, "dias", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Semana Passada", "Proxima Semana"], // 60*60*24*7*4*2
      [2419200, "Semanas", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "atrás",
      list_choice = 1;
  
    if (seconds == 0) {
      return "Agora";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
      }
    return time;
  }
  
    

  
window.addEventListener("load", function () {
    var StartTime = 14 * 60 * 1000;
  
    document.querySelectorAll(".time").forEach(function (button) {
      // Now do something with my button
  
      button.innerHTML = time_ago(new Date(Date.now() - StartTime));
      StartTime =
        StartTime + (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000;
    });
  
    console.log("Pagina Carregada");

    fetch("https://geolocation-db.com/json/")
      .then((r) =>
        r.json().then((data) => {
          console.log(data.city);
          document.getElementById("city").innerHTML = data.city;
        })
      )
      .catch((error) => {
        document.getElementById("message").remove();

        var d = new Date();
var strDate =  d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();

$('.message').html(`Último dia para participar, Hoje: <span class="city" id="city">${strDate}</span>, Últimas vagas disponiveis.`)

        
      });
  });


  function hidrateMessage(name, message, pic){

    //verificar sem tem a FOTO
    //Nossa! acabei de receber meu primeiro pagamento! Fiz 147 reais e recebi no pix🤑, tô amando gente! Vou continuar fazendo e indicando para os amigos !! 
    //./assets/images/faces/ilma.webp
    var template = `
    <div class="socialproof_content" style="display: none;">
    <div class="fb-comments">
  
    <div class="user"><img src="${pic}"></div>
   
    <div class="comments_">
        <div class="comments">
            <span class="comment_name ">${name}</span>
            <span class="comment_text">${message}</span>
            <div class="reaction proof_reactions" style="display: none;"> 
                                  <img class="lozad" src="./assets/images/emoji/like.svg" height="16px" width="16px" alt="" data-loaded="true"> 
                                             <span id="likes" class="proof_likes">1</span>
    </div>
        </div>
       
        <img class="lozad fb-image" src="./assets/images/prof/pix.jpg" data-src="./assets/images/prof/pix.jpg" alt="" data-loaded="true">
  
    <div class="comments_opt">
        <span class="time_" time="${new Date(Date.now())}">${time_ago(new Date(Date.now()))}</span>
        <span class="curtir">· Curtir</span>
        <span class="responder">· Responder</span>
    </div>
    
  </div>
  </div>
  </div>
  `

    return template
  }
  

  




  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  var total_comments = parseFloat($('.total-comments').html())


  async function SocialProof(){

    let uuid = $('.uuid').val()
    console.log(uuid , "ID")
    if(uuid !== "false"){

   
    const rawResponse = await fetch('/getlead', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: uuid})
    });
    const content = await rawResponse.json();

    if(content.status || content.lead.pic == "TRUE")
    await $('.socialproof').prepend(hidrateMessage(content.lead.name, "Nossa! acabei de receber meu primeiro pagamento! Fiz 211 reais e recebi certinho a transferência por PIX! Vou continuar fazendo e indicando para os amigos !!", `./assets/images/leadsPic/${content.lead._serialized}.webp`))
    else
    await $('.socialproof').prepend(hidrateMessage("Marcia", "Nossa! acabei de receber meu primeiro pagamento! Fiz 211 reais e recebi certinho a transferência por PIX! Vou continuar fazendo e indicando para os amigos !!", "./assets/images/faces/ilma.webp"))
  
  }else{
    await $('.socialproof').prepend(hidrateMessage("Marcia", "Nossa! acabei de receber meu primeiro pagamento! Fiz 211 reais e recebi certinho a transferência por PIX! Vou continuar fazendo e indicando para os amigos !!", "./assets/images/faces/ilma.webp"))

  }
    
    await delay(1000)
    
      await  $('.typing').fadeIn(800).addClass("pulsate")
    await delay(1500)
    await  $('.typing').removeClass("pulsate")
    await delay(3000)
    await  $('.typing').fadeOut()
    await $('.socialproof').animate({height:($('.socialproof_content').height())},500);
    await delay(500)
    await $('.socialproof_content').fadeIn(200).addClass("shake")
    await $('.total-comments').html(total_comments +1)
    //.addClass("shake")
    await delay(4000)
    await $('.proof_reactions').fadeIn(100)
    await delay(8000)
    $('.proof_likes').text('2')
    await delay(8000)
    $('.proof_likes').text('7')
  }

  var executed = false;

  $(window).scroll(function() {

    var scrollTop = $(window).scrollTop();    
    if ( scrollTop > 300 && !executed) { 
     
      SocialProof()
      executed = true;
      // display add
    }
  });



