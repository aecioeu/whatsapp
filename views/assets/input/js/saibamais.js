
     const observer = lozad('.lozad', {
        rootMargin: '10px 0px', // syntax similar to that of CSS Margin
        threshold: 0.1, // ratio of element convergence
        enableAutoReload: true // it will reload the new image when validating attributes changes
        });
    observer.observe();
    
    $('form').on('submit', function (e) {
    
    e.preventDefault();
    
    $.ajax({
        type: 'post',
        url: '/lead',
        data: $('form').serialize(),
        success: function (data) {
             console.log(data)
             $('#formulario').hide().empty().html('<p>Solicite os numeros no Whatsapp</p>')
             $('#formulario').fadeIn() 
         
            }
    });
     
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