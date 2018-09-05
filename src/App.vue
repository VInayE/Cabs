<template>
<router-view></router-view>
</template>

<style>
 @import url('https://unpkg.com/vuetify@0.15.2/dist/vuetify.min.css');


@font-face {
  font-family:'Roboto-400';
  src: url(./fonts/roboto_400.woff2) format('woff2'),
       url(./fonts/roboto_400.woff) format('woff'),
       url(./fonts/roboto_400.ttf) format('truetype')

}

@font-face {
  font-family: 'Roboto-500';
  src: url(./fonts/roboto_500.woff2) format('woff2'),
       url(./fonts/roboto_500.woff) format('woff'),
       url(./fonts/roboto_500.ttf) format('truetype')

}
/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(./fonts/google_fonts.eot);
  src: url(./fonts/google_fonts.woff2) format('woff2'),
       url(./fonts/google_fonts.woff) format('woff'),
        url(./fonts/google_fonts.ttf) format('truetype')
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
.color-red{
  color:#EA2330!important;
}
.bg-red{
  background-color:#EA2330!important;
}
html {
  font-family:'Roboto-400'!important;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.centerMarker{
  position:absolute;
  background:url(./assets/PickupPin.png) no-repeat;
  top:50%;left:50%;
  z-index:1;
  margin-left:-10px;
  margin-top:-34px;
  height:34px;
  width:30px;
  cursor:pointer;
}
.toolbar__content{
  height:60px;
}
.roboto-400{
    font-family: 'Roboto-400';
}

.cab_type_tabs>.tabs__wrapper>.tabs__container>li>.tabs__item.tabs__item--active{
  color:#EA2330!important;
  font-family:'Roboto-500';
  border-bottom:2px solid #EA2330!important;
}
.cab_type_tabs>.tabs__wrapper>.tabs__container,.cab_vendor_option>.tabs__wrapper>.tabs__container,.cab-operator>.tabs__wrapper>.tabs__container{
  transform : unset!important;
  transition:none!important;
}
.cab-operator>.tabs__wrapper>.tabs__container{
  overflow-y:auto!important
}


.application .theme--dark.tabs .tabs__item.tabs__item--active{
  color:#EA2330!important;

}
.cab_type_tabs>.tabs__wrapper>.tabs__container>.tabs__li,.cab_vendor_option>.tabs__wrapper>.tabs__container>.tabs__li {
  flex:1!important;
}
.cab-operator >.tabs__wrapper>.tabs__container{
  justify-content: unset!important;
  text-align: center!important;
}
.cab-operator >.tabs__wrapper>.tabs__container>.cabsProduct{
  display: inline-block;
  margin: 0 auto;
}
.application .theme--dark.tabs .tabs__item {
    color: #757575;
    opacity: .8;
    font-weight:500;
    font-family:'Roboto-500'; text-transform: capitalize;
	font-size:12px;
}
.tabs__slider{
  background:#EA2330!important;
}
.dialog__content{
  z-index:20!important;
}

.pac-container:after {
background-image: none !important;
height: 0px;
}

.pac-container{
  margin-top:10px!important;
  background-color:transparent;
  border:0px!important;
  box-shadow:none!important;
}
.pac-container>.pac-item{
  height:50px!important;
  margin-top:2px;
  background-color:white;
  padding-top:10px!important;
}
.pac-item-query{
 position: relative; top: -5px;
}
.pac-container>.pac-item > span:last-child{
  display: flex;
  position: relative;
  top: -18px;
  left: 23px;
}

.rentalType > .input-group{
  padding:0 0 0px;
}
.rentalType > .input-group>.input-group__details{
  display:none!important;
}

.picker--time{
  width:100%!important;
}
.picker--date{
  width:100%!important;
}
.txt-right>.input-group__input>input{
  text-align:right!important;
}
.txt-r {
text-align: right;
}
.filterIcon {
  background:url(./assets/filter-icon.svg) no-repeat;
  height:25px;
  width:25px;
  position:absolute;
  right:0px;
  top:15px;
  margin-right:15px;
}
.pencilIcon {
  background:url(./assets/pencil.svg) no-repeat;
  height:20px;
  width:25px;
  position:absolute;
  right:-25px;
  display: inline-block;
}
.tickIcon {
  background:url(./assets/icon-tick.png) no-repeat;
  height:20px;
  width:25px;
  position:absolute;


}
.help_icon{
  background:url(./assets/ic-help.svg) no-repeat;
  height: 24px;
  width: 24px;
  display: block;
}

.drop-icon{
  background:url(./assets/ic-pin-drop.svg) no-repeat;
  height: 24px;
  width: 24px;
  display: inline-block;
}
.payment-icon{
  background:url(./assets/ic-payment.svg) no-repeat;
  height: 24px;
  width: 24px;
  display: inline-block;
}
.vender-icon{
  background:url(./assets/ic-vender.svg) no-repeat;
  height: 24px;
  width: 24px;
  display: inline-block;
}
.icon_center_location{
  background:url(./assets/ic-my-location.svg) no-repeat;
}
.srp_toolbar>.tabs__wrapper--scrollable>ul{
   font-size:12px!important;
}
h2,h3{
font-size: 16px!important;
color: rgba(0, 0, 0, 0.87)!important;
font-weight: bold;
margin-bottom:0px;
line-height:inherit;
}
.txt_blue{
  color:rgb(25, 118, 210)!important;
}
.cabsProduct>a{
      display:block!important;
 }

 .cabs_option{
   height:90px;
 }
   .srp_toolbar>.tabs__wrapper--scrollable{
  background: #333; color: #fff;
  }

  .text-right{
    text-align: right;
  }
  .fs-xlg{
  font-size: 18px;
  }
 .cab_type_tabs> div > ul{
    height: 45px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 3px;
 }
 .cab_vendor_option{
   height:30px;
 }
 .txt_terms{
   white-space: inherit;
 }
 input{
   outline:0px;
 }
 body {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
.rental_packages>.input-group__details,.date-field >.input-group__details {
    color: transparent!important;
}
.rental_packages>.input-group__details:before,.date-field >.input-group__details:before {
    background-color: transparent!important;
}
.radio_text{
  margin-top:10px!important;
}
.radio_text>label{
  margin-top:-3px!important;
}
.cab-trip {
width: 100%;
}
#tab-p2p{
  transition:unset!important;
}
.cab_vendor_option>.tabs__wrapper>ul>li>a{
  border-bottom:2px solid!important
}
.srp_toolbar>.tabs__wrapper>.tabs__container>.tabs__li>.tabs__item--active{
  color:white!important;
  opacity:1!important;
}
.option_advance>.rental_packages{
  padding-top: 0px;
  padding-bottom: 0px;
}
.promo-input>.input-group__input>input{
  text-transform:uppercase!important;
  font-size:13px!important;
}

.txt_white,.txt-ff{
  color:white;
}
.snack__content{
  font-size:12px!important;
  padding: 9px!important;
}
.snack__content>button{
    color: #EA2330!important;
    margin: 0px!important;
}
.red{
   background-color:#EA2330!important;
}
.rental_packages>.input-group__input>div>div>label{
  font-size:14px!important;
}
.facebookBlock>div{
   padding:0px!important

}
.register-head{
  padding:0px!important
}
.fs14{
  font-size:14px;
}
input{
  font-size:16px;
  font-weight:normal
}
.bg-white {
  background: #fff;
  height: 100%;
}
.prel {
position: relative;
}
.pabs {
 position: absolute;
}
  .net-banking label {
    margin-top: -18px;
}
.cab_type_tab{
  padding:0px!important
}
.input-group--text-field input{
  height: 25px;
}
.list__tile__title{
  height: auto;
    line-height: normal;
}
.text-center{
    text-align: center;
}
#app .cl_white_back{
  color: #333 !important;
}
.toolbar .toolbar__content>.btn:first-child{
    margin-left: 5px;
}
.pa-3>.p2p_review_footer{
  margin-left:0px!important;
  margin-right:0px!important;
}
.p2p_rental_packages>.input-group__details{
     display:none!important;
 }
.wrapper .card{
      box-shadow: none;
}
.promoCode_text_field>.input-group__details{
  height:0px!important
}

.icon_center .btn__content{
    padding: 0;
}

.box_shadow_cab>div>div{
   padding:0px!important;
   border-bottom:0px!important;
}
.application--light .input-group:not(.input-group--error) .input-group__details:before {
  background-color: #e0e0e0!important;
}
.application--light .input-group:not(.input-group--error) label{
   color: #bdbdbd;
   font-family: 'Roboto-400';
   font-size: 15px;
}
.application--light .btn--disabled[data-v-6a872814]:not(.btn--icon):not(.btn--flat) {
    background-color: #EA2330!important;
    color: #fff!important;
    font-family: 'Roboto-500'!important;
    text-transform: capitalize!important;
}
.input-group--required label:after{
  content: " "!important;
}

.refund-policy h3{
    font-size: 15px !important;
}
.tab-bank>label{
  text-transform:uppercase!important;
}
.font-bold{
  font-weight:bold;
}
.login-view .input-group__input{
  border-bottom: 1px solid #e0e0e0;
}
.login-view .primary--text {
  color: rgba(0,0,0,0.54);
}
.gst .input-group__input {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
}
.drivingl .input-group__input{
  border-bottom: 1px solid #e0e0e0;
}
.promo-input .input-group__input {
  border: 1px solid #999;
  padding: 10px;
}
.promo-input .input-group__details {
  display: none;
  }
.option_advance .input-group__details {
  display: none;
}
.option_advance > div {
  border-bottom: 1px solid #e0e0e0;
}
.tank-type > div {
  padding-top: 0;
}
.tank-type .pdl12 {
  border-bottom: 1px solid #e0e0e0;
}
.mt15 {
  margin-top: 15px;
}
@media screen and (orientation: landscape) and (min-width: 568px) {
		body:before {
			content: "Please rotate your device !!";
			width: 100vw;
			height: 100vh;
			background: #f1f1f1 url("./assets/smartphone.svg") no-repeat 50% 15%;
			background-size: 20%;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			position: fixed;
			z-index: 9999;
			display: block;
			overflow: hidden;
			box-sizing: border-box;
			padding-top: 50vh;
			font-size: 18px;
			font-weight: bold;
			text-align: center;
			color: #666;
      line-height: 60px;
		}
		body:after {
			content: "We don't support landscape mode yet. Please go back to potrait mode for best experience";
			width: 90vh;
			height: 25vh;
			text-align: center;
			font-size: 16px;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 5vh;
			z-index: 10000;
			display: block;
			margin: auto;
			color: #666;
		}
	}
.input-group__details:before {
    height: 0;
}
.menu__content {
  z-index: 99 !important;
}

li{
  list-style: none;
}
.img-resp {
		width: 100%;
		height: auto;
}

</style>
