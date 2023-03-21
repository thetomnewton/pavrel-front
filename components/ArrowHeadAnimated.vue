<template>
  <svg viewBox="0 0 12 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      class="arrow-head"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.29297 0.292787C6.4805 0.105316 6.7348 0 6.99997 0C7.26513 0 7.51944 0.105316 7.70697 0.292787L11.707 4.29279C11.8944 4.48031 11.9998 4.73462 11.9998 4.99979C11.9998 5.26495 11.8944 5.51926 11.707 5.70679L7.70697 9.70679C7.51837 9.88894 7.26576 9.98974 7.00357 9.98746C6.74137 9.98518 6.49056 9.88001 6.30515 9.6946C6.11974 9.5092 6.01457 9.25838 6.0123 8.99619C6.01002 8.73399 6.11081 8.48139 6.29297 8.29279L8.58597 5.99979C8.60447 6.01944 10.5 4.99979 8.58597 3.99979L6.29297 1.70679C6.1055 1.51926 6.00018 1.26495 6.00018 0.999786C6.00018 0.734622 6.1055 0.480314 6.29297 0.292787Z"
    />
    <path
      class="arrow-body"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.586 5.99979H1C0.734784 5.99979 0.48043 5.89443 0.292893 5.70689C0.105357 5.51936 0 5.265 0 4.99979C0 4.73457 0.105357 4.48022 0.292893 4.29268C0.48043 4.10514 0.734784 3.99979 1 3.99979H8.586C9.7189 4.48983 9.7514 5.49116 8.586 5.99979Z"
    />
  </svg>
</template>

<style>
.arrow-parent path {
  transition: all 0.1s ease-in-out;
}
.arrow-parent .arrow-head {
  transform: translateX(-4px);
}
.arrow-parent .arrow-body {
  transform: translateX(-10px);
}
.arrow-parent:hover .arrow-head,
.arrow-parent:hover .arrow-body {
  transform: translateX(0);
}
</style>
