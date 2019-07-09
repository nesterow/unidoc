$(document).ready(function() {
	
    /* ===== Stickyfill ===== */
    /* Ref: https://github.com/wilddeer/stickyfill */
    // Add browser support to position: sticky
    var elements = $('.sticky');
    Stickyfill.add(elements);


    /* Activate scrollspy menu */
    $('body').scrollspy({target: '#doc-menu', offset: 100});
    
    /* Smooth scrolling */
	$('a.scrollto').on('click', function(e){
        //store hash
        var target = this.hash;    
        e.preventDefault();
		$('body').scrollTo(target, 800, {offset: 0, 'axis':'y'});
		
	});
     
    /* Bootstrap lightbox */
    /* Ref: http://ashleydw.github.io/lightbox/ */

    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    });
    $('table').addClass('table table-bordered')
    setTimeout(function(){
        document.body.classList.remove('loading')
    },300);
    $('code').each((i, e)=>{
        var lang = e.classList[0];
        if (Prism.languages[lang]) {
            e.innerHTML = Prism.highlight(e.textContent, Prism.languages[lang], lang)
        }
    })
    var headers = $('h2,h4');
    function initNavi(){
        var nav = document.querySelector('showdown-nav');
        if (!nav) return;
        var top = nav.getBoundingClientRect().top;
        if (top === 0) {
            if (!nav.classList['scrolled'])
                nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        headers.each((i, e) => {
            if (e.getBoundingClientRect().top <= 20) {
                $('.nav-link').removeClass('active');
                $('a[href="#'+e.id+'"]').addClass('active');
            }
        })
    }
    initNavi();
    $(window).on('scroll', initNavi);

    $('a').on('click', function(){
        if (this.getAttribute('href').indexOf('#') !== 0 && this.getAttribute('target') !== '_blank') {
            document.body.classList.add('loading')
        }
    })
    
});