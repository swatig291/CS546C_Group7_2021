$(document).ready(function() {

$('#static-update-form').on('submit', (event) => {
    event.preventDefault();
    let spaceName = $('#spaceName').find('input').val();
    let length = $('#length').find('input').val();
    let width = $('#width').find('input').val();
    let height = $('#height').find('input').val();
    let price = $('#price').find('input').val();
    let streetAddress = $('#streetAddress').find('input').val();
    let city = $('#city').find('input').val();
    let state = $('#state').find('input').val();
    let zip = $('#zip').find('input').val();
    let longitude = $('#longitude').find('input').val();
    let latitude = $('#latitude').find('input').val();
    let id = $('#editSpaceId').find('input').val();
    let hasError = false;
    //firstName validation
    if (!spaceName || spaceName.trim().length == 0) {
        $("<p/>").addClass("error").text('spaceName cannnot be empty.').appendTo('#spaceName');
        hasError = true;
    }
    if (!length || length.trim().length == 0 ||length < 0) {
        $("<p/>").addClass("error").text('Invalid length').appendTo('#length');
        hasError = true;
    }
    if (!width || width.trim().length == 0 || width < 0) {
        $("<p/>").addClass("error").text('Invalid width').appendTo('#width');
        hasError = true;
    }
    if (!height || height.trim().length == 0 || height < 0) {
        $("<p/>").addClass("error").text('Invalid height').appendTo('#height');
        hasError = true;
    }
    if (!price || price.trim().length == 0 || price < 1) {
        $("<p/>").addClass("error").text('price cannnot be empty or less than 1.').appendTo('#price');
        hasError = true;
    }
    if (!streetAddress || streetAddress.trim().length == 0) {
        $("<p/>").addClass("error").text('streetAddress cannnot be empty.').appendTo('#streetAddress');
        hasError = true;
    }
    if (!city || city.trim().length == 0) {
        $("<p/>").addClass("error").text('city cannnot be empty.').appendTo('#city');
        hasError = true;
    }
    if (!state || state.trim().length == 0) {
        $("<p/>").addClass("error").text('state cannnot be empty.').appendTo('#state');
        hasError = true;
    }
    if (!zip || zip.trim().length == 0) {
        $("<p/>").addClass("error").text('zip cannnot be empty.').appendTo('#zip');
        hasError = true;
    }
    if (!description) {
        $("<p/>").addClass("error").text('description cannnot be empty.').appendTo('#description');
        hasError = true;
    }
    if (!longitude || longitude.trim().length == 0) {
        $("<p/>").addClass("error").text('longitude cannnot be empty.').appendTo('#longitude');
        hasError = true;
    }
    if (!latitude || latitude.trim().length == 0) {
        $("<p/>").addClass("error").text('latitude cannnot be empty.').appendTo('#latitude');
        hasError = true;
    }
    if (!id || id.trim().length == 0) {
        $("<p/>").addClass("error").text('id cannnot be empty.').appendTo('#editSpaceId');
        hasError = true;
    }
    if(!hasError){
        $('#static-update-form').unbind('submit').submit();
     }
});

})