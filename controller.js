$(document).ready(function(){

  $("#search").unbind().on("keyup", function(keyEvent) {
    var resultLINK;
    var libLINK;
    var input = $(this).val().toLowerCase(); //inicializa o valor do campo #search já minusculo
    var resultJSON;
    var libJSON

    input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //funçao que normaliza o input(tira os acentos), achei no stackoverflow :D
    resultLINK = "https://api.cdnjs.com/libraries?search=" + input; //inicializa a biblioteca pesquisada

    //Gera a lista no HTML
    $("div.result").append(`
      <ul id="list">
      </ul>
    `)

    if(keyEvent.handled !== true){
      //Gera um objeto Json dos resultados e adiciona por nome na lista do HTML
      $.when(
        $.getJSON(resultLINK, function(result){
          resultJSON = result;
        })
        .fail(function(jqXHR, textStatus, errorThrown){
          alert('getJSON request failed! ' + textStatus);
        }),
      ).then(function() {
        $.each(resultJSON.results, function(i, field){
          $("#list").append(
            $('<li>').append(field.name)
          );
        });
      });
    }

    //filtra cada elemento da lista ao teclar
    $("#list li").filter(function() {
      $(this).toggle($(this).text().indexOf(input) > -1)
      //var input = $(this).toggle($(this).text())
    });

    //caso um resultado seja clicado
    $('#list li').unbind().on('click', function(clickEvent) {
      libLINK = "https://api.cdnjs.com/libraries/" + $(this).text(); //Coloca na URL o nome completo da biblioteca selecionada

      $("#main").removeClass("result").addClass("lib"); //troca a classe da div de result para lib
      $("ul").remove();

      if(clickEvent.handled !== true){
          //Gera um objeto Json da bibliotecas e adiciona suas informações
          $.when(
            $.getJSON(libLINK, function(lib){
              libJSON = lib;
            })
            .fail(function(jqXHR, textStatus, errorThrown){ 
              alert('getJSON request failed! ' + textStatus);
            }),
          ).then(function() {
            $(".lib").append('<p>' + libJSON.name + '</p>').find("p:last").addClass("name");
            $(".lib").append('<p>' + libJSON.description + '</p>').find("p:last").addClass("description");

            $(".lib").append('<hr>');

            $(".lib").append('<p><b>homepage</b>: ' + libJSON.homepage + '</p>').find("p:last").addClass("info");
            $(".lib").append('<p><b>repository</b>: ' + libJSON.repository.url + '</p>').find("p:last").addClass("info");
            $(".lib").append('<p><b>version</b>: ' + libJSON.version + ' &bull; <b>license</b>: ' + libJSON.license + '</p>').find("p:last").addClass("info")
          });
        }

    });

    $(".lib h1, .lib p, .lib hr").remove(); //remove os conteudos dentro da lib
    $("#main").removeClass("lib").addClass("result"); //troca a classe de lib para result
  });
});
