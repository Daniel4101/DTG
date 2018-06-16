//--- zmienne
var amount_arch = 0;
var counter_names =[["drugim","trzecim","czwartym","piÄ…tym","szÃ³stym"],["drugiego","trzeciego","czwartego","piÄ…Â…tego","szÃ³stego"]];
var wiecej = 0;
//------------------------------------------------------------------------------
//--- wywoÅ‚ania obliczeÅ„Â„ -------------------------------------------------------
//------------------------------------------------------------------------------

$( window ).load(function() {
    calc_send(wiecej);
});

$( window ).load(function() {
    $( "input.run" ).on("click", function() {
        calc_send(wiecej);
    });

    $( "input.run_number" ).on("change", function() {
        calc_send(wiecej);
    });
});



//------------------------------------------------------------------------------
//--- zachowanie pÃ³l kalkulatora -----------------------------------------------
//------------------------------------------------------------------------------


//-- nakÅ‚ad > 0 i nakÅ‚Â‚ad (liczby cÅ‚kowite) nakÅ‚ad < 1000000000
$(document).ready(function(){
    $("input[name=naklad]").on("change", function(){
        $(this).val(parseInt($(this).val()));

        if( $(this).val() <= 0 ){
            $(this).val(1);
        }
        if( $(this).val() >= 1000000000 ){
            $(this).val(1000000000);
        }

    });
});

//--- wysuwanie dodatkowych opcji
$(document).ready(function(){
    numeration();
});

$(document).ready(function(){
    $(".more").click(function(){
        if(wiecej == 0){
            $(this).text("ZwiÅ„ dodatkowe opcje");
            wiecej = 1;
        }else{
            $(this).text("RozwiÅ„ wiÄ™Â™cej opcji");
            wiecej = 0;
        }
    });
});

$(document).ready(function(){
    $(".more").click(function(){
        for(var i=10;i<=24;i++){
            var tag = "#" + i;
            $(tag).slideToggle(function(){
                numeration();
            });
        }
        calc_send(wiecej);
    });
});


//--- wywoÅ‚Â‚uje numeracje punktÃ³w po kaÅ¼dej zmianie
$(document).ready( function() {
    $(document).change(function(){
        numeration();
    });
});




//--- powtarzajace siÄ™ pytania (5)
//--- w klonach zmieniam nazwy id,for,name
$(document).ready(function(){
    $("input[name=liczba_miejsc]").change(function(){
        var clone_id = 1;
        var amount = $("input[name=liczba_miejsc]:checked").val() - 1;

        if(amount>amount_arch){

            clone_id += amount_arch;

            for(clone_id; clone_id<= amount;clone_id++){
                var $clone = $("#nadruki").clone(true);

                $clone.attr("id", "nadruki_clone"+clone_id);
                $clone.find("input[name=wielkosc]").attr("name","wielkosc_clone"+clone_id);

                $clone.find("#title_5").attr("id","title_5_clone"+clone_id);
                $clone.find("#title_5_clone"+clone_id).text("WielkoÅ›Ä‡Â‡ "+counter_names[1][clone_id-1]+" nadruku?");


                for(var i=1;i<=6;i++){
                    if($clone.find("#wielkosc_"+i)){
                        $clone.find("#wielkosc_"+i).attr("id","wielkosc_"+i+"_clone"+clone_id);
                        $clone.find("label[for=wielkosc_"+i+"]").attr("for","wielkosc_"+i+"_clone"+clone_id);
                    }
                }

                $clone.hide(function(){

                    $clone.appendTo("#nadruki_here").show(function(){

                        $("label[for=wielkosc_1_clone"+clone_id+"]").click();
                    });
                });



            }
            calc_send(wiecej);

        }else if(amount<amount_arch){

            for(var i=amount+1;i<=amount_arch;i++){

                $("#nadruki_clone"+i).remove();

            }
            calc_send(wiecej);
        }




        amount_arch = amount;
    }) ;
});

$(document).on("keypress", ":input:not(textarea)", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
});

var titles = '';
var titles_data = 'pole=pole';
var inputs_data = 'zaznacz=zaznaczone';
var inputs = '';
var id = '';
var i = 0;
var cena_sztuka = 'Null';
var cena_razem = 'Null';
var koszt_transportu = 'Null';
var rodzaj_znakowania = '';
$(window).load(function(){
    $('#download').click(function(){
        i = 0;
        titles_data = 'pole=pole';
        inputs_data = 'zaznacz=zaznaczone';

        $("p[class=h]").each(function(){
            if(!$(this).is(':hidden')){
                titles += $(this).text()+"\n";
                titles_data += "&"+i+"="+$(this).text();
                i++;
            }

        });

        //$("input:checked").each(function(){
        $("input").each(function(){
            if($(this).is(':checked') || $(this).prop('type') == 'number'){

                if($(this).prop('type') == 'radio'){
                    id = $(this).attr('id');
                    if(!$("label[for = "+id+"]").is(':hidden')){
                        inputs += $("label[for = "+id+"]").text()+"\n";
                        inputs_data += "&"+i+"="+$("label[for = "+id+"]").text();
                        i++;
                    }
                }else{
                    if(!$(this).is(':hidden')){
                        inputs += $(this).val()+"\n";
                        inputs_data += "&"+i+"="+$(this).val();
                        i++;
                    }
                }
            }

        });

        cena_sztuka = $('#price').text();
        cena_razem = $('#price_all').text();
        koszt_transportu = $('strong[id=transport]').text();
        rodzaj_znakowania = $('a[class=active]').text();

        var data2 = titles_data;

        $.post(tpl_url+"/partials/calc/download.php",data2+"&"+inputs_data+"&cena_sztuka="+cena_sztuka+"&cena_razem="+cena_razem+"&koszt_transportu="+koszt_transportu+"&rodzaj_znakowania="+rodzaj_znakowania,function(response, status){
            if(status == 'success'){
                //alert(response);
                download();
            }
        });


    });

});



//------------------------------------------------------------------------------
//--- funkcje ------------------------------------------------------------------
//------------------------------------------------------------------------------

//--- kod odpowiadajÄ…cy za przekazanie zawartoÅ›ci wygenerowanego pdf'a do iframe. W celu pobrania go.
function download()
{
    var ifrm = document.getElementById('frame');
    ifrm.src = tpl_url+"/partials/calc/download.php";
}

//--- wysyÄ¹Â‚a dane do obliczenia
function calc_send(wiecej){
    var result = 0;
    var result_transport = 12.00;
    var result_karton = 1;
    var karton_name = "karton";

    var data =  $("form").serialize();
    //alert(data);
    $.post(tpl_url+"/calc/calculation.php",data+"&typ=dtg&wiecej="+wiecej,function(response, status){
        //alert(response);
        data = JSON.parse(response);

        result = parseFloat(data[0]).toFixed(2);
        result_transport = parseFloat(data[1]).toFixed(2);
        result_karton = parseInt(data[2]);
        result_naklad = parseInt(data[3]);

        //result_all = parseFloat(result * result_naklad);

        //if($('#c108').is(':checked')) {
        //    result_all = result_all*data[4];
        //}
        //result_all = result_all.toFixed(2);
        result_all = parseFloat(result * result_naklad).toFixed(2);

        $("#price").html(result +" zÅ‚");
        $("#transport").html(result_transport +" zÅ‚");
        if(result_transport == 0){
            $("karton").html("Koszt transportu :");
        }else{
            if(result_karton == 1){
                karton_name = "karton";
            }else if(result_karton == 2 || result_karton == 3 || result_karton == 4){
                karton_name = "kartony";
            }else{
                karton_name = "kartonÃ³w";
            }
            $("karton").html("Koszt transportu ("+result_karton+" "+karton_name+"):");
        }
        $("#price_naklad").html(result_naklad);
        $("#price_all").html(result_all +" zÅ‚Â‚");
    });

}

//--- numeracja punktÃ³w
function numeration(){

    var id = 1;
    $(document).ready(function(){
        $(".number").each(function(){
            if($(this).parents(".calc-row").css('display') != "none"){
                $(this).text(id);
                id++;

            }
        });
    });


}