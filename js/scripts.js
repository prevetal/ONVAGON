WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]


document.addEventListener('DOMContentLoaded', function () {
	// Lots slider
	const lotsSliders = [],
		lots = document.querySelectorAll('.lots .swiper')

	lots.forEach((el, i) => {
		el.classList.add('lots_s' + i)

		let options = {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			lazy: true,
			breakpoints: {
				0: {
					spaceBetween: 16,
					slidesPerView: 'auto'
				},
				480: {
					spaceBetween: 20,
					slidesPerView: 'auto'
				},
				768: {
					spaceBetween: 24,
					slidesPerView: 2
				},
				1024: {
					spaceBetween: 24,
					slidesPerView: 3
				},
				1280: {
					spaceBetween: 24,
					slidesPerView: 4
				}
			},
			on: {
				init: swiper => setHeight(swiper.el.querySelectorAll('.lot')),
				resize: swiper => {
					let items = swiper.el.querySelectorAll('.lot')

					items.forEach(el => el.style.height = 'auto')

					setHeight(items)
				}
			}
		}

		lotsSliders.push(new Swiper('.lots_s' + i, options))
	})


	// Mob. menu
	$('.mob_header .mob_menu_btn, .overlay').click(e => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('lock')
		$('.mob_menu').toggleClass('show')

		$('.mob_header .mob_menu_btn').hasClass('active')
			? $('.overlay').fadeIn(300)
			: $('.overlay').fadeOut(200)
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: 'Закрыть',
		NEXT: 'Следующий',
		PREV: 'Предыдущий',
		MODAL: 'Вы можете закрыть это модальное окно нажав клавишу ESC'
	}


	// Zoom images
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	// Phone input mask
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Custom select - Nice select
	const selects = document.querySelectorAll('select'),
		selectsArr = []

	if (selects) {
		selects.forEach(el => {
			selectsArr.push(NiceSelect.bind(el, {
				placeholder: el.getAttribute('data-placeholder')
			}))

			el.addEventListener('change', () => el.classList.add('selected'))
		})
	}


	// Form inputs
	$('.form .input, .form textarea').keydown(function() {
		let _self = $(this)

		setTimeout(() => {
			_self.val().length
				? _self.addClass('active')
				: _self.removeClass('active')
		})
	})


	// Toggle password input type
	$('.form .toggle_type').click(function(e) {
		e.preventDefault()

		$(this).toggleClass('active')

		$(this).hasClass('active')
			? $(this).closest('.field').find('.input').attr('type', 'text')
			: $(this).closest('.field').find('.input').attr('type', 'password')
	})


	// Mini popups
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Close the popup when clicking outside of it
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Filter
	$('.category_info .mob_filter_btn').click(function(e) {
		e.preventDefault()

		$('body').toggleClass('lock filter_open')
		$('.category_info aside').addClass('show')
		$('.overlay').fadeIn(300)
	})


	$('.filter .close_btn').click(function(e) {
		e.preventDefault()

		$('body').toggleClass('lock filter_open')
		$('.category_info aside').removeClass('show')
		$('.overlay').fadeOut(200)
	})


	$priceRange = $('.filter #price_range').ionRangeSlider({
		type: 'double',
		min: 0,
		max: 8000000,
		from: 480110,
		to: 7780110,
		step: 10,
		onChange: data => {
			$('.filter .price_range .from span').text(data.from.toLocaleString())
			$('.filter .price_range .to span').text(data.to.toLocaleString())
		},
		onUpdate: data => {
			$('.filter .price_range .from span').text(data.from.toLocaleString())
			$('.filter .price_range .to span').text(data.to.toLocaleString())
		}
	}).data('ionRangeSlider')


	$('.filter .form .mini_modal .checkbox').click(function(e) {
		if (e.target.nodeName == 'LABEL') {
			let _self = $(this)

			setTimeout(() => {
				let parent =_self.closest('.line'),
					checkboxes = parent.find('.mini_modal input:checked'),
					text = []

				// Generate text
				if (checkboxes.length) {
					checkboxes.each(() => text.push($(this).find('.check + *').text()))
				}

				// Set count
				checkboxes.length
					? parent.find('.name').addClass('blue').find('.count').text(checkboxes.length)
					: parent.find('.name').removeClass('blue').find('.count').text('0')

				// Set text
				text.length
					? parent.find('.mini_modal_btn span').text(text.join(', '))
					: parent.find('.mini_modal_btn span').text((''))
			})
		}
	})



	// Datepicker
	const dateInputs = document.querySelectorAll('.input_date')

	dateInputs.forEach(el => {
		new AirDatepicker(el, {
			autoClose: true
		})
	})


	$('.filter .form .reset_btn').click(function() {
		if ($priceRange) {
			$priceRange.reset()
		}

		if (selectsArr.length) {
			selectsArr.forEach(el => {
				el.update()

				$('.filter .form select').removeClass('selected')
			})
		}

		$('.filter .form .name').removeClass('blue')
		$('.filter .form .name .count').text('(0)')
		$('.filter .form .name .clear_btn').removeClass('show')

		$('.filter .form .mini_modal_btn span').text('')
	})


	// Lot info
	if ($('.lot_info .images').length) {
		const lotThumbs = new Swiper('.lot_info .images .thumbs .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 10,
			lazy: true,
			slidesPerView: 4,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		})

		new Swiper('.lot_info .images .big .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 10,
			slidesPerView: 1,
			lazy: true,
			thumbs: {
				swiper: lotThumbs
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			}
		})
	}


	$('.lot_info .timer').each(function () {
		$(this).countdown($(this).data('date'), function (event) {
			$(this).find('.days .val').text(event.strftime('%D'))
			$(this).find('.hours .val').text(event.strftime('%H'))
			$(this).find('.minutes .val').text(event.strftime('%M'))
		})
	})


	$('.lot_info .main_col .head').click(function(e) {
		e.preventDefault()
		e.stopPropagation()

		$(this).toggleClass('active').next().slideToggle(300)
	})

	$('.lot_info .main_col .head .download_all a').click(function(e) {
		e.stopPropagation()
	})


	$('.lot_info .btn').click(function(e) {
		e.preventDefault()

		$(this).hide()
		$('.lot_info .exp').hide()

		$('.lot_info .new_rate').fadeIn(200)
	})
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || BODY.clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Overwrite window width
		WW = window.innerWidth || document.clientWidth || BODY.clientWidth


		// Mob. version
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})



// Map
function initMap() {
	ymaps.ready(() => {
		let myMap = new ymaps.Map('map', {
			center: [54.982383, 73.376611],
			zoom: 16,
			controls: []
		})

		// Custom marker
		let myPlacemark = new ymaps.Placemark([54.982383, 73.376611], {}, {
			iconLayout : 'default#image',
			iconImageHref : 'images/map_marker.svg',
			iconImageSize : [40, 40],
			iconImageOffset : [-20, -40]
		})

		myMap.geoObjects.add(myPlacemark)

		myMap.behaviors.disable('scrollZoom')
	})
}