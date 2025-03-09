const title = document.getElementById('title');

const options = {
  root: null,
  rootMargin: '0px　0px -50% 0px',
  threshold: 0.5
};

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      title.classList.add('active');
    } else {
      title.classList.remove('active');
    }
  });
};

const observer = new IntersectionObserver(callback, options);

observer.observe(title);
