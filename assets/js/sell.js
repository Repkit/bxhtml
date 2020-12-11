window.sell = window.sell || new Sell() ;

function Sell() {
    this.formmap = {"book_edition":"Edition","book_author":"Author","book_isbn":"ISBN","book_id":"Id"
        ,"book_university":"University","book_program":"Programme","book_year":"AcademicYear","book_desc":"Desc"};

    this.validateISBN = function(el){
        let subject = el.value;
        let validator = document.getElementById("#isbn_validator");
        var regex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
        if (regex.test(subject)) {
            var chars = subject.replace(/[- ]|^ISBN(?:-1[03])?:?/g, "").split("");
            var last = chars.pop();
            var sum = 0;
            var check, i;

            if (chars.length == 9) {
                chars.reverse();
                for (i = 0; i < chars.length; i++) {
                    sum += (i + 2) * parseInt(chars[i], 10);
                }
                check = 11 - (sum % 11);
                if (check == 10) {
                    check = "X";
                } else if (check == 11) {
                    check = "0";
                }
            } else {
                for (i = 0; i < chars.length; i++) {
                    sum += (i % 2 * 2 + 1) * parseInt(chars[i], 10);
                }
                check = 10 - (sum % 10);
                if (check == 10) {
                    check = "0";
                }
            }
            if (check == last) {
                validator.style.display = "none";
            } else {
                validator.style.display = "block";
            }
        } else {
            validator.style.display = "block";
        }
        return false;
    }
    this.populateForm = function(item){
        item["_source"]["Cover"] = "https://www.studystore.nl/images/"+ item["_source"]["ISBN"] +"/1/1";
        item["_source"]["Id"] = item["_id"];
        let self = this;
        for (const [key, value] of Object.entries(self.formmap)) {
            document.getElementById(key).value=item["_source"][value];
        }
        document.getElementById("book_preview").src=item["_source"]["Cover"];
        var university = {
            id: item._id,
            text: item._source.University
        };
        var univerisityOption = new Option(university.text, university.text, true, true);
        $('#book_university').append(univerisityOption).trigger('change');
        $('#book_desc').attr("disabled", true);
    }
    this.clearForm = function(){
        let self = this;
        for (const [key, value] of Object.entries(self.formmap)) {
            document.getElementById(key).value="";
        }
        document.getElementById("book_preview").src = "";
    }
};

$( "#priceAmount" ).keyup(function(event) {
    let price = parseInt($(this).val());
    let container = $("#comReturn");
    let yourprice = 0;

    if(price === 0 || isNaN(price)){
        container.html('');
        return;
    }

    if(price < 25){
        yourprice = price - 0.5;
    }else if (price >= 25 && price < 65){
        yourprice = price - 1;
    } else{
        yourprice = price - ((5 / 100) * price).toFixed(3);
    }
    container.html('You will receive: <br><span style="font-size:30px;display:block;font-weight:600;margin-top:0px;">€' + yourprice + '</span>');
});

// cloudinary.applyUploadWidget(document.getElementById('cloudinaryUpload'),
let uploadBookImages = cloudinary.createUploadWidget(
    {
        cloudName: "repkit-by-mistake-com",
        uploadPreset: "y16pnnfu",
        clientAllowedFormats: ["png", "jpeg"],
        buttonCaption: "Upload real photos of your book",
        inlineContainer: "#cloudinaryUploadContainer"
    }, (error, result) => { });
uploadBookImages.open();

// Wait for the DOM to be ready
$(function() {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='list']").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            query: "required",
            edition: "required",
            author: "required",
            // email: {
            //     required: true,
            //     // Specify that email should be validated
            //     // by the built-in "email" rule
            //     email: true
            // },
            // password: {
            //     required: true,
            //     minlength: 5
            // }
        },
        // Specify validation error messages
        messages: {
            query: "Please enter the book's name",
            edition: "Please enter the book's edition",
            author: "Please enter the book's author",

            // password: {
            //     required: "Please provide a password",
            //     minlength: "Your password must be at least 5 characters long"
            // },
            // email: "Please enter a valid email address"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            form.submit();
        }
    });
});

