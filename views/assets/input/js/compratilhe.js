/** */

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            timer = duration;
        }
    }, 900);
}


window.onload = async function () {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
    $('.progress-bar-fill').css("width", "20%")
    setTimeout(() => {
        $('.progress-bar-fill').html(`20%`)    
    }, 600);

    setInterval(() => {
        $('.btn-purple').addClass("shake") 
      }, 3000);
      setInterval(() => {
        $('.btn-purple').removeClass("shake") 
      }, 3500);
    
};


function Share(earn, url, uuid){
}
$('form').on('submit', function (e) {
    
    e.preventDefault();
    
    $.ajax({
        type: 'post',
        url: '/share',
        data: $('form').serialize(),
        success: function (data) {
             console.log(data)

             const nl = '%0A'
             var message = ``
             message += `*Vejá como eu Ganhei*${nl}`
             message += `https://google.com.br`
             var link = `whatsapp://send/?text=${message}`

            window.open(link, '_blank')

           
             var current = parseFloat($('.progress-bar-fill').text().replace(/[^0-9]/g,''))
             if(current < 100)
             $('.progress-bar-fill').css("width", current + 10 + "%").html(`${current+10}%`)

             //$('#formulario').hide().empty().html('<p>Solicite os numeros no Whatsapp</p>')
             //$('#formulario').fadeIn() 

             //whatsapp://send/?text={text}%20{url}
         
            }
    });
     
    });