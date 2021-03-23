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
        $('#book_desc').attr("readOnly", true);
        $('#book_isbn').attr("readOnly", true);
        $("#book_noisbn").attr("disabled", true);
        $("#ajaxSearchty").attr("readOnly", true);

        document.getElementById('book_isbn').style.borderColor='#000';
        uploadBookImages.update({tags: [document.getElementById('book_isbn').value, 'deleted']});
        uploadBookImages.open();
    }
    this.clearForm = function(){
        let self = this;
        for (const [key, value] of Object.entries(self.formmap)) {
            document.getElementById(key).value="";
        }
        document.getElementById("book_preview").src = "";
        document.getElementById("book_university").value="";
        $('#book_isbn').attr("readOnly", false);
        $("#book_noisbn").attr("disabled", false);
        $("#ajaxSearchty").attr("readOnly", false);
        $('#book_desc').attr("readOnly", false);
        uploadBookImages.update({tags: null});
        uploadBookImages.close({quiet: true});

    }
    this.getPriceFee = function(price){
        let yourprice = 0;
        price = parseFloat(price);
        if(price < 25){
            yourprice = price - 0.5;
        }else if (price >= 25 && price < 65){
            yourprice = price - 1;
        } else{
            yourprice = price - ((5 / 100) * price).toFixed(3);
        }

        return yourprice;
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

    yourprice = sell.getPriceFee(price);

    if (document.getElementById('promotebook').checked) {
        yourprice = yourprice - 1;
    }
    container.html('You will receive: <br><span style="font-size:30px;display:block;font-weight:600;margin-top:0px;">€' + yourprice + '</span>');
});

$("#promotebook").change(function(e){
    $("#priceAmount").trigger("keyup");
});

let validateisbn = ( value )=>{
    if(10 == value.length || 13 == value.length){
        return true;
    }
    return false;
};

// cloudinary.applyUploadWidget(document.getElementById('cloudinaryUpload'),
let uploadBookImages = cloudinary.createUploadWidget(
    {
        cloudName: "repkit-by-mistake-com",
        uploadPreset: "y16pnnfu",
        clientAllowedFormats: ["png", "jpeg"],
        buttonCaption: "Upload real photos of your book",
        inlineContainer: "#cloudinaryUploadContainer",
        // form: "#bookform",
        thumbnails:"#uploadedimages",
        // thumbnailTransformation: [{ width: 100, height: 100, crop: 'fit' }],
        // preBatch: (cb, data) => {
        //     console.log(data);
        //     if (true) {
        //         cb({cancel: true});
        //     } else {
        //         cb();
        //     }
        // }
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
            var form = document.getElementById("sellBook");
            var x = document.createElement("INPUT");
            x.setAttribute("type", "hidden");
            x.setAttribute("name", "pids[]");
            x.setAttribute("value", result.info.public_id);
            form.appendChild(x);
            var y = document.createElement("INPUT");
            y.setAttribute("type", "hidden");
            y.setAttribute("name", "Gallery[]");
            y.setAttribute("value", result.info.secure_url);
            form.appendChild(y);
        }
    });

document.getElementById("cloudinaryUploadContainer").style['min-height'] = null;
document.getElementById("ajaxSearchty").addEventListener("blur", function(){
    if (this.value.length < 1){
        return;
    }
    let tag = tb.md5(unescape(encodeURIComponent(this.value)));
    let uid = tb.getCookie('uid');
    let uname = tb.getCookie('uname');
    if(!uid){
        alert('please reload the page your session had expired!');
        location.reload();
        return;
    }
    uploadBookImages.update({tags: [tag, tag+uid, uname, uid, 'deleted']});
    uploadBookImages.open();
    this.readOnly = true;
},false);
document.getElementById("shipmentPrice").addEventListener("blur", function(){
    // console.log('lost focus');
    if (!this.checked){
        if(parseInt(this.value) > 0){
            document.getElementById("allowShipping").click();
        }
    } else {
        if(parseInt(this.value) == 0){
            document.getElementById("allowShipping").checked = false;
        }
    }
}, false);

// document.getElementById("book_isbn").addEventListener("blur", function(){
//     // console.log('lost focus');
//     if (validateisbn(this.value)){
//         this.style.borderColor='#000';
//         uploadBookImages.update({tags: [this.value, 'deleted']});
//         uploadBookImages.open();
//     } else {
//         this.style.borderColor='#ff0000';
//         uploadBookImages.update({tags: null});
//         uploadBookImages.close({quiet: true});
//     }
// }, false);

// Wait for the DOM to be ready
$(function() {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("#sellBook").validate({
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
            if (!window['_bxloggedin_']){
                $('#signIn').modal('show');
                return;
            }
            let token = tb.getCookie('token');
            let uid = tb.getCookie('uid');
            if(!token){
                alert('token expired');
                location.reload();
            }
            if(!uid){
                alert('session expired');
                location.reload();
            }
            $("#_csrf").val(uid+'bx'+token);
            form.submit();
        }
    });
});

