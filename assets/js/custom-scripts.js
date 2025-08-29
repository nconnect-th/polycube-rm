jQuery(document).ready(function($) {
    var counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var $number = $(entry.target);
                var data = $number.data();
                
                $number.numerator({
                    toValue: data.toValue,
                    fromValue: data.fromValue,
                    duration: data.duration,
                    delimiter: data.delimiter || ','
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    $('.elementor-counter-number').each(function() {
        counterObserver.observe(this);
    });
}); 