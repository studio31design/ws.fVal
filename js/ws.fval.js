/*
WS.FVAL.JS
simple form validation
© 2011 Will Stern  | willstern.com/web
*/
(function($){
	//setup the object containing functions
	var wsfv = {
		init : function(){
			//create error messages
			wsfv.er = {};
			wsfv.er.phonerequired = 'required';
			wsfv.er.phoneshort = 'please enter full phone number';
			wsfv.er.phonelong = 'please enter only 10 digits';
			wsfv.er.daterequired = 'required';
			wsfv.er.dateerror1 = 'please format mm/dd/yyyy';
			wsfv.er.dateerror2 = 'please format mm/dd/yyyy';
			wsfv.er.emailrequired = 'email required';
			wsfv.er.emailerror = 'must be full email address';
			wsfv.er.urlrequired = 'required';
			wsfv.er.invalidurl = 'must be a valid URL';
			wsfv.er.requirederror = 'required';
			wsfv.er.numbererror = 'numbers only';
			wsfv.er.minlengtherror = function(o){
				wsfv.er.minchar = ' characters';
				if(o.type == 'number'){ if(o.minLength && o.minLength == 1){wsfv.er.minchar = ' number';} else {wsfv.er.minchar = ' numbers';}}
				if(o.minLength){
					return 'must have at least '+o.minLength+wsfv.er.minchar;
				}
			};
			
			wsfv.er.maxlengtherror = function(o){
				wsfv.er.maxchar = ' characters';
				if(o.type == 'number'){wsfv.er.maxchar = ' numbers';}
				if(o.maxLength){
					return 'maximum of '+o.maxLength+wsfv.er.maxchar;
				}
			};
			//end error messages
		},
		error : function(id,text,o){
				if(o.notify){
					
					if(o.notify == 'asterisk'){
						if($('#wsfver'+o.id).length > 0){
							$('#wsfver'+o.id).hide();
						} else {
							$(id).after('<span id="wsfver'+o.id+'" style="color:#ff9999;display:none">*</span>');
						}
						$('#wsfver'+o.id).fadeIn();
					}
					
					if(o.notify == 'dot'){
						if($('#wsfver'+o.id).length > 0){
							$('#wsfver'+o.id).hide();
						} else {
							$(id).after('<span id="wsfver'+o.id+'" style="display:none"><img src="images/errordot.png"/></span>');
						}
						$('#wsfver'+o.id).fadeIn();
					}
					if(o.notify == 'red'){
						$(id).css('background-color','#f9a7a7');	
					}
				}
				if(o.errorId){
					//and error id is set, echo the error text
					$('#'+o.errorId).hide().html(text).fadeIn();
				}
				//inc the error
				$(id).data('error',1);
		},
		resetError : function(id,o){
				if(o.notify){
					if(o.notify == 'asterisk' || o.notify == 'dot'){
						$('#wsfver'+o.id).fadeOut();
					}
					if(o.notify == 'red'){
						$(id).css('background-color','#fff');	
					}
					
				}
				$('#'+o.errorId).fadeOut();
					$(id).data('error',0);
					
		},
		//create check functions
		checkPhone : function(id,o){
			var p = $(id).val().replace(/[^0-9]/g,'');
			//if it errors
			if(p == ''){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.phonerequired,o);}
				fail = 1;
			} else if(p.length < 10){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.phoneshort,o); }
				fail = 1;
			} else if(p.length > 10){
				if(o.errorId){
				 if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.phonelong,o); }
				 fail = 1;
				}
			} else {
			//we pass
				//detect basic
				if(o.format && o.format == 'numbers'){
					$(id).val(p);
				} else {
					//go standard
					$(id).val('('+p.substr(0,3)+') '+p.substr(3,3)+'-'+p.substr(6,4));
				}
				//if it has an error, reset the error and dec form errors
				wsfv.resetError(id,o);
				fail = 0;
			}
			return fail;
		},
		checkDate : function(id,o){
			var fail = 0;
			//get value
			d = $(id).val();
			
			//if it errors
			if(!d.match(/\S/g)){
			 if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.daterequired,o); }
			 fail = 1;
			} else if(d.match(/\d/g).length <3){
			 if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.dateerror1,o); }
			 fail = 1;
			}else if(d.match(/[^0-9\-\/\.]/)){
			 if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.dateerror2,o); }
			 fail = 1;
			} else {
				d = d.replace(/\s/,'');
				d = d.match(/\d+/g);
				
			if(d.length < 3){
			  if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.dateerror1,o); }
			  fail = 1;	
			} else {
							
				//reformat if year is first 
				if(d[0].length == 4){
					
					//fix m/d to mm/dd - shouldn't be a problem if someone's entering yyyy/mm/dd format, though
					if(d[1].length == 1){d[1] = '0'+d[1];}
					if(d[2].length == 1){d[2] = '0'+d[2];}
					
					if(o.format && o.format == 'mysql'){
						$(id).val(d[0]+'-'+d[1]+'-'+d[2]);				
					} else if(o.format && o.format == 'dash'){
						$(id).val(d[1]+'-'+d[2]+'-'+d[0]);
					} else {
						$(id).val(d[1]+'/'+d[2]+'/'+d[0]);
					}
				} else if(d[2].length == 4) {
				//if year is last	
					
					if(d[0].length == 1){d[0] = '0'+d[0];}
					if(d[1].length == 1){d[1] = '0'+d[1];}
					
					if(o.format && o.format == 'mysql'){
						$(id).val(d[2]+'-'+d[0]+'-'+d[1]);				
					} else if(o.format && o.format == 'dash'){
						$(id).val(d[0]+'-'+d[1]+'-'+d[2]);
					} else {
						$(id).val(d[0]+'/'+d[1]+'/'+d[2]);
					}
				} else {
				//d-dig year is last
					if(d[2]<20){ 
						d[2] = parseInt(d[2])+2000;
					} else { 
						d[2] = parseInt(d[2])+1900
					}
					if(d[0].length == 1){d[0] = '0'+d[0];}
					if(d[1].length == 1){d[1] = '0'+d[1];}
					if(o.format && o.format == 'mysql'){
						$(id).val(d[2]+'-'+d[0]+'-'+d[1]);				
					} else if(o.format && o.format == 'dash'){
						$(id).val(d[0]+'-'+d[1]+'-'+d[2]);
					} else {
						$(id).val(d[0]+'/'+d[1]+'/'+d[2]);
					}
					
				}
				wsfv.resetError(id,o);
				fail = 0;
				}
			}
			return fail;
			},
		checkRequired : function(id,o){
			var fail = 0;		
			if($(id).val().match(/\S/) < 1){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.requirederror,o);	}
				fail = 1;
			} else if(o.minLength && $(id).val().length < o.minLength){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.minlengtherror(o),o); }
				fail = 1;
			} else if(o.maxLength && $(id).val().length > o.maxLength){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.maxlengtherror(o),o); }
				fail = 1;
			} else {
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.resetError(id,o); }
				fail = 0;
			}
			return fail;
		},
		checkNumber : function(id,o){
			var fail = 0;
			var v = $(id).val();
			v = v.replace(/[^0-9]/g,'');
			if($(id).val().match(/\D/g)){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.numbererror,o); }
				fail = 1;	
			} else if(v.length < 1){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.requirederror,o);	}
				fail = 1;
			} else if(o.minLength && v.length < o.minLength){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.minlengtherror(o),o); }
				fail = 1;
			} else if(o.maxLength && v.length > o.maxLength){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.maxlengtherror(o),o); }
				fail = 1;
			} else {
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.resetError(id,o); }
				fail = 0;
			}	
			return fail;
		},
		checkEmail : function(id,o){
			var fail = 0;
			v = $(id).val();
			if(v.match(/\S/)){
				at = v.split('@');
				dot = v.split('.');
				
			}
			if(!v.match(/\S/)){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.emailrequired,o); }
				fail = 1;
			} else if (!v.match(/@/) || !v.match(/\./)){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.emailerror,o); }
				fail = 1;
			//alright, let's try to be sneakier than them
			} else if(at[0].match(/[\(\)\[\]\\\;\:\,\<\>]/) || at.length > 2 || at[0]=='' || v.match(/@\.|\.@/) || dot[dot.length-1].length < 2 || dot[dot.length-1].length > 5 || dot[dot.length-1].match(/[0-9]/) || !at[0].match(/[A-z0-9]/) || dot[dot.length-1].match(/[^A-z]/)){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.emailerror,o); }
				fail = 1;
			} else {
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.resetError(id,o); }
				fail = 0;
			}	
			return fail;
		},
		checkUrl : function(id,o){
			var fail = 0;
			u = $(id).val();
			if(u.match(/^http\:\/\//)){
				var url = u.replace(/^http\:\/\//,'');
				var dot = url.split('.');
			}
			if(!u.match(/\S/)){
			 if(o.error){wsfv.error(io,o.error,o);}
				else { wsfv.error(id,wsfv.er.urlrequired,o); }
			 fail = 1;	
			} else if(!u.match(/^http\:\/\//)){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.invalidurl,o); }
				fail = 1;
			} else if(!url.match(/\./) || dot[dot.length-1].match(/[A-z]/g).length < 2 || dot[dot.length-1].match(/[^A-z]/) || 
			url.match(/^\./) || url.match(/[^A-z0-9-\.]/) ){
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.error(id,wsfv.er.invalidurl,o);	}
				fail = 1;
			} else {
				if(o.error){wsfv.error(id,o.error,o);}
				else { wsfv.resetError(id,o); }
				fail = 0;
			}
			return fail;
		},
		parentForm : function(id){
			$(id).parent('form').addClass('fVal').submit(function(){
					var fail = 0;
					$(this).children('.fVal').each(function(){
						var childo = $(this).data('o');
						childo.validate = true;
						fail += $(this).fVal(childo);
					});
					if(fail > 0){ return false; }
							
			});
		}				
	}
	wsfv.init();
	
	//the actual plugin
	$.fn.fVal = function(o){
		var id = this
		var fail = 0;
		if(o && o.type){ //it has options, so it's a go	
			o.id = this.attr('id');
			this.data({'error':'0','o':o}).addClass('fVal'); //add fval class for tracking, add no errors, store options object as data				
			if(!$(this).parent('form').hasClass('fVal')){ //parent form has not been initialized...do that
				wsfv.parentForm(this);	
			}
			//check type
			if(o.type == 'phone'){	
				//set phone
				this.blur(function(){
					wsfv.checkPhone(this,o);
				});
				if(o.validate){fail = wsfv.checkPhone(this,o);}
			}
			
			if(o.type == 'date'){
				this.blur(function(){
					wsfv.checkDate(this,o);
				});
				if(o.validate){fail = wsfv.checkDate(this,o);}
			}
				
			if(o.type == 'required'){
				this.blur(function(){
					wsfv.checkRequired(this,o);
				});
				if(o.validate){fail = wsfv.checkRequired(this,o);}
			}
				
			if(o.type == 'number'){
				this.blur(function(){
					wsfv.checkNumber(this,o);
				});
				if(o.validate){fail = wsfv.checkNumber(this,o);}
			}
				
			if(o.type == 'email'){
				this.blur(function(){
					wsfv.checkEmail(this,o);
				});
				if(o.validate){fail = wsfv.checkEmail(this,o);}
			}
				
			if(o.type == 'url'){
				this.blur(function(){
					wsfv.checkUrl(this,o);
				});
				if(o.validate){fail = wsfv.checkUrl(this,o);}
			}
		} return fail;
	} 
	
})(jQuery);