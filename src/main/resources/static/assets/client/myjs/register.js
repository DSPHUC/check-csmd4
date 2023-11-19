let province = document.getElementById('province');
let district = document.getElementById('district');
let ward = document.getElementById('ward');
const urlApiProvince = 'https://vapi.vnappmob.com/api/province/';
const urlApiDistrict = 'https://vapi.vnappmob.com/api/province/district/';
const urlApiWard = 'https://vapi.vnappmob.com/api/province/ward/';
let registerForm = $('#registerForm');

async function getAllProvinces() {
    const response = await fetch(urlApiProvince);
    const data = await response.json();
    const provinces = data.results;
    for (let item of provinces) {
        const str = renderOptionProvince(item);
        province.innerHTML += str;
    }
}

async function getAllDistrictsByProvinceId(provinceID) {
    const response = await fetch(urlApiDistrict + provinceID);
    const data = await response.json()
    const districts = data.results;
    district.innerHTML = '';
    for (let item of districts) {
        const str = renderOptionDistrict(item);
        district.innerHTML += str;
    }
}

async function getAllWardsByDistrictId(districtID) {
    const response = await fetch(urlApiWard + districtID);
    const data = await response.json();
    const wards = data.results;
    ward.innerHTML = '';
    for (let item of wards) {
        const str = renderOptionWard(item);
        ward.innerHTML += str;
    }
}

province.onchange = function () {
    const provinceID = this.value;
    getAllDistrictsByProvinceId(provinceID).then(data => {
        const districtID = district.value;
        getAllWardsByDistrictId(districtID);
    });
}

district.onchange = function () {
    const districtID = this.value;
    getAllWardsByDistrictId(districtID).then(data => {
    });
}

const renderOptionProvince = (obj) => {
    return `<option value="${obj.province_id}">${obj.province_name}</option>`;
}

const renderOptionDistrict = (obj) => {
    return `<option value="${obj.district_id}">${obj.district_name}</option>`;
}

const renderOptionWard = (obj) => {
    return `<option value="${obj.ward_id}">${obj.ward_name}</option>`;
}

registerForm.validate({
    onkeyup: function (element) {
        $(element).valid()
    },
    onclick: false,
    onfocusout: false,
    rules: {
        fullName: {
            required: true
        },
        phoneNumber: {
            required: true
        },
        email: {
            required: true
        },
        address: {
            required: true
        },
        username: {
            required: true
        },
        password: {
            required: true
        }

    },
    messages: {
        fullName: {
            required: 'fullName không được để trống'
        },
        phoneNumber: {
            required: 'phoneNumber không được để trống'
        },
        email: {
            required: 'email không được để trống'
        },
        address: {
            required: 'address không được để trống'
        },
        username: {
            required: 'username không được để trống'
        },
        password: {
            required: 'password không được để trống'
        }
    },
    errorLabelContainer: "#registerForm .area-error",
    errorPlacement: function (errol, element) {
        errol.appendTo("#registerForm .area-error");
    },
    showError: function (errorMap, errorList) {
        if (this.numberOfInvalids() > 0) {
            $("#registerForm .area-error")
                .removeClass("hide")
                .addClass("show");
        } else {
            $("#registerForm .area-error")
                .removeClass("show")
                .addClass("hide").empty();
            $("#registerForm input.error").removeClass("error");
        }
        this.defaultShowErrors();
    },
    submitHandler: () => {
        registerValid()

    }
})


registerValid = async () => {
    let fullName = $('#fullName').val();
    let phoneNumber = $('#phoneNumber').val();
    let email = $('#email').value;
    let username = $('#username').val();
    let password = $('#password').val();
    let provinceId = province.selectedOptions[0].value;
    let provinceName = province.selectedOptions[0].textContent;
    let districtId = district.selectedOptions[0].value;
    let districtName = district.selectedOptions[0].textContent;
    let wardId = ward.selectedOptions[0].value;
    let wardName = ward.selectedOptions[0].textContent;
    let address = $('#address').val();
    const location = {
        provinceId: provinceId,
        provinceName: provinceName,
        districtId: districtId,
        districtName: districtName,
        wardId: wardId,
        wardName: wardName,
        address: address
    }
    const data = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        username: username,
        password: password,
        address: address,
        location: location
    }
    const response = await  fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    console.log(response)
    if (response.ok) {
        registerForm.reset();
        webToast.Success({
            status: `Đăng kí tài khoản thành công`,
            message: '',
            delay: 2000,
            align: 'topright'
        });
    }
}

registerForm.onsubmit = function (event) {
    event.preventDefault();
    registerForm.trigger("submit");
}

window.onload = () => {
    getAllProvinces().then(data => {
        const provinceID = province.value;
        getAllDistrictsByProvinceId(provinceID).then(data => {
            const districtID = district.value;
            getAllWardsByDistrictId(districtID);
        });
    })
}