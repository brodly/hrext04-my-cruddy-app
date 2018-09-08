$(document).ready(function() {

  $(".add-text-btn").on("click", function(){

    // store values
    let inputKey = $(".user-input-title").val();
    let inputValue = $(".user-input-body").val();

    // clear values
    $(".user-input-title").val("");
    $(".user-input-body").val("");

    console.log(inputKey, inputValue);

    localStorage.setItem(inputKey, inputValue);
    // data-
    let itemHtml = `<div class="display-item" data-storage-key="${inputKey}">Title: ${inputKey} Body: ${localStorage.getItem(inputKey)}</div>`;
    $(".display").html(itemHtml);
    //console.log(localStorage);
    // how can we delegate this event to the outer html node?
    // https://learn.jquery.com/events/event-delegation/

    $(".display-item").on("click", function(e){
      // plop the key:value back into the input boxes

      // get the values from the the divs?
      console.log("key=> ", e.target.dataset.storageKey); // user-input-title
      localStorage.getItem(e.target.dataset.storageKey); // user-input-body

      // set those values in the form fields
      $(".user-input-title").val(e.target.dataset.storageKey);
      $(".user-input-body").val(localStorage.getItem(e.target.dataset.storageKey));
    });

  });

   // TODO add back in later
   // $(".user-input").on("keyup", function(){
   //   let inputValue = $(".user-input").val();
   //   localStorage.setItem("testStorage", inputValue);
   //   $(".display").text(localStorage.getItem("testStorage"));
   // });

   $(".del-text-btn").on("click", function() {
     alert('item deleted? check the console'); // maybe change to a window.confirm
     localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
     $(".user-input-title").val("");
     $(".user-input-body").val("");

     // clearing display? what if I have multiple items?
     // after item is removed from local storage, redisplay items from local storage
     // refresh from storage?

   });

   // iterative approach to adding items
   // store data as stringified array of objects
   // store data with individual keys
  // how do we get keys? research Object.keys

  $(".add-category-item").on("click", function() {
    var category = prompt('New Category Name');
    if (category !== null) {
      if (category !== '') {
        category = category[0].toUpperCase() + category.slice(1);
        $(".content-row select").append(`<option value="${category.toLowerCase()}">${category}</option>`);
        $(".category-list").append(`<div class="category-item" id="${category.toLowerCase()}">${category}</div>`);
      } else {
        console.log('Category is NULL')
      }
    }
  });

  $(".category-item").on('mouseover', function(event){
    //console.log(event);
    // var $categoryName = $(`#${event.target.id}`);
    // $categoryName.css()
  });

  $(".category-item, .add-category-item").hover(function(){
    if (!$(this).hasClass('animated')) {
      $(this).dequeue().stop().animate({ 
        fontSize: "1.25em", 
      });
    }
  }, function() {
      $(this).addClass('animated').animate({  
        fontSize: "1em" 
      }, "slow", "linear", function() {
      $(this).removeClass('animated').dequeue();
    });
  });
});