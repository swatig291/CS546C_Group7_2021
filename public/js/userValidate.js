$(document).ready(function() {

    $('#signup-form').on('submit', (event) => {
        event.preventDefault();
        $('.error').empty();

        let firstName = $('#firstName').find('input').val();
        let lastName = $('#lastName').find('input').val();
        let email = $('#email').find('input').val();
        let password = $('#password').find('input').val();
        let phoneNumber = $('#phoneNumber').find('input').val();
        let ssn = $('#ssn').find('input').val();
        let hasError = false;
        //firstName validation
        if(!firstName || firstName.trim().length==0) {
            $("<p/>").addClass( "error" ).text('First name must be provided.').appendTo('#firstName');
            hasError =true;
        }
        
        //lastName validation
        if(!lastName || lastName.trim().length==0) {
            $("<p/>").addClass( "error" ).text('Last name must be provided.').appendTo('#lastName');
            hasError =true;
        }
        //email validation
        if(!email || email.trim().length==0){
            $("<p/>").addClass( "error" ).text('Email must be provided').appendTo('#email');
            hasError =true;
        } 
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(email).toLowerCase())){
            $("<p/>").addClass( "error" ).text('Email must be of valid type').appendTo('#email');
            hasError =true;
        }
        
        //password validation
        if(!password || password.trim().length==0){
            $("<p/>").addClass( "error" ).text('Password must be provided').appendTo('#password');
            hasError =true;
        }
        if(!/[^\s]/.test(password)){
            $("<p/>").addClass( "error" ).text('Password cannot consist spaces').appendTo('#password');
            hasError =true;
        }
        if(password.length<6){
            $("<p/>").addClass( "error" ).text('Password should consist atleast 6 characters').appendTo('#password');
            hasError =true;
        }
            
        //phoneNumber validation
        if(!phoneNumber || phoneNumber.trim().length==0){
            $("<p/>").addClass( "error" ).text('Phone Number must be provided').appendTo('#phoneNumber');
            hasError =true;
        }
        if(!/[0-9]{10}/.test(phoneNumber)){
            $("<p/>").addClass( "error" ).text('Phone Number is invalid.').appendTo('#phoneNumber');
            hasError =true;
        }
        
        //ssn validation
        if(!ssn || ssn.trim().length==0){
            $("<p/>").addClass( "error" ).text('SSN must be provided').appendTo('#ssn');
            hasError =true;
        }
        if(!/^[0-9]{9}/.test(ssn)){
            $("<p/>").addClass( "error" ).text('SSN is invalid').appendTo('#ssn');
            hasError =true;
        }

          //submitting the form after validation
          if(!hasError){
             $('#signupForm').unbind('submit').submit();
            
          }
        
    });

} ) 

  