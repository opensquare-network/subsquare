import ReactQuill, { Quill } from "react-quill";
import "quill-mention";
import ImageResize from "quill-image-resize-module";
import MagicUrl from "quill-magic-url";
import React, { useState, useRef, useEffect, useMemo } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

const icons = Quill.import("ui/icons");
icons["bold"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2C3.44772 2 3 2.44772 3 3V8V13C3 13.5523 3.44772 14 4 14H9.5C11.433 14 13 12.433 13 10.5C13 9.24701 12.3416 8.14781 11.3519 7.52949C11.7599 6.95707 12 6.25657 12 5.5C12 3.567 10.433 2 8.5 2H4ZM8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4H5V7H8.5ZM5 9V12H9.5C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9H8.5H5Z"/></svg>';
icons["italic"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 2.75C6 2.33579 6.33579 2 6.75 2H13.25C13.6642 2 14 2.33579 14 2.75C14 3.16421 13.6642 3.5 13.25 3.5H10.7445L6.8874 12.5H9.25C9.66421 12.5 10 12.8358 10 13.25C10 13.6642 9.66421 14 9.25 14H2.75C2.33579 14 2 13.6642 2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H5.25545L9.1126 3.5H6.75C6.33579 3.5 6 3.16421 6 2.75Z" /></svg>';
icons["underline"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.29749 1.30762C4.70647 1.30762 5.03801 1.63916 5.03801 2.04814V7.28694C5.03801 8.07253 5.35009 8.82595 5.90558 9.38144C6.46108 9.93694 7.2145 10.249 8.00009 10.249C8.78569 10.249 9.53911 9.93694 10.0946 9.38144C10.6501 8.82595 10.9622 8.07253 10.9622 7.28694V2.04814C10.9622 1.63916 11.2937 1.30762 11.7027 1.30762C12.1117 1.30762 12.4432 1.63916 12.4432 2.04814V7.28694C12.4432 8.46533 11.9751 9.59545 11.1419 10.4287C10.3086 11.2619 9.17848 11.7301 8.00009 11.7301C6.8217 11.7301 5.69158 11.2619 4.85833 10.4287C4.02508 9.59545 3.55697 8.46533 3.55697 7.28694V2.04814C3.55697 1.63916 3.88851 1.30762 4.29749 1.30762ZM2.07593 13.9516C2.07593 13.5426 2.40747 13.2111 2.81645 13.2111H13.1837C13.5927 13.2111 13.9243 13.5426 13.9243 13.9516C13.9243 14.3606 13.5927 14.6921 13.1837 14.6921H2.81645C2.40747 14.6921 2.07593 14.3606 2.07593 13.9516Z" /></svg>';
icons["strike"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1345 9.60462C12.319 10.0186 12.4121 10.479 12.4121 10.9844C12.4121 12.061 11.9917 12.9033 11.1518 13.509C10.3103 14.1146 9.14949 14.4179 7.6678 14.4179C6.50234 14.4179 5.34757 14.178 4.20295 13.6978C3.93034 13.5834 3.76104 13.3117 3.76104 13.0161C3.76104 12.4268 4.40501 12.052 4.95508 12.2635C5.79174 12.5851 6.64135 12.7461 7.50415 12.7461C9.55059 12.7461 10.5766 12.1589 10.5838 10.9836C10.5881 10.7453 10.5442 10.5086 10.4549 10.2877C10.3465 10.0196 10.1723 9.80324 9.96774 9.60381H0.780029V7.9994H15.2198V9.60381L12.1345 9.60462ZM8.8631 7.19799H4.49346C4.35293 7.06986 4.22383 6.92975 4.1076 6.77923C3.76104 6.3316 3.58776 5.79091 3.58776 5.15396C3.58776 4.16243 3.96159 3.3193 4.70845 2.62459C5.45691 1.92988 6.6129 1.58252 8.17801 1.58252C9.20648 1.58252 10.1966 1.78239 11.1472 2.18212C11.406 2.29096 11.5649 2.54998 11.5649 2.83078C11.5649 3.39529 10.9457 3.75894 10.4091 3.58343C9.7742 3.37573 9.10435 3.27197 8.39942 3.27197C6.40994 3.27197 5.416 3.8993 5.416 5.15396C5.416 5.49089 5.59088 5.78449 5.94065 6.03559C6.29041 6.28668 6.722 6.48643 7.23461 6.63724C7.73198 6.78164 8.27508 6.96936 8.8631 7.19799Z" /></svg>';
icons["link"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.77494 3.27518C7.64246 3.41735 7.57033 3.6054 7.57376 3.7997C7.57719 3.994 7.6559 4.17938 7.79331 4.3168C7.93073 4.45421 8.11611 4.53292 8.31041 4.53635C8.50471 4.53978 8.69276 4.46766 8.83494 4.33518L10.0849 3.08518C10.2707 2.89936 10.4913 2.75195 10.7341 2.65139C10.9769 2.55082 11.2371 2.49906 11.4999 2.49906C11.7627 2.49906 12.0229 2.55082 12.2657 2.65139C12.5085 2.75195 12.7291 2.89936 12.9149 3.08518C13.1007 3.271 13.2481 3.4916 13.3487 3.73438C13.4492 3.97717 13.501 4.23739 13.501 4.50018C13.501 4.76297 13.4492 5.02318 13.3487 5.26597C13.2481 5.50875 13.1007 5.72935 12.9149 5.91518L10.4149 8.41518C10.2291 8.60113 10.0086 8.74865 9.76582 8.84929C9.52302 8.94994 9.26277 9.00175 8.99994 9.00175C8.7371 9.00175 8.47685 8.94994 8.23405 8.84929C7.99126 8.74865 7.77068 8.60113 7.58494 8.41518C7.44276 8.2827 7.25471 8.21057 7.06041 8.214C6.86611 8.21743 6.68073 8.29614 6.54331 8.43355C6.4059 8.57097 6.32719 8.75635 6.32376 8.95065C6.32033 9.14495 6.39246 9.333 6.52494 9.47518C6.84995 9.80022 7.2358 10.0581 7.66046 10.234C8.08512 10.4099 8.54028 10.5004 8.99994 10.5004C9.45959 10.5004 9.91475 10.4099 10.3394 10.234C10.764 10.0581 11.1499 9.80022 11.4749 9.47518L13.9749 6.97518C14.6313 6.31876 15.0001 5.42848 15.0001 4.50018C15.0001 3.57187 14.6313 2.68159 13.9749 2.02518C13.3185 1.36876 12.4282 1 11.4999 1C10.5716 1 9.68135 1.36876 9.02493 2.02518L7.77494 3.27518ZM3.08494 12.9152C2.89898 12.7294 2.75146 12.5089 2.65082 12.2661C2.55017 12.0233 2.49836 11.763 2.49836 11.5002C2.49836 11.2374 2.55017 10.9771 2.65082 10.7343C2.75146 10.4915 2.89898 10.2709 3.08494 10.0852L5.58494 7.58518C5.77068 7.39922 5.99126 7.2517 6.23405 7.15106C6.47685 7.05041 6.7371 6.9986 6.99994 6.9986C7.26277 6.9986 7.52302 7.05041 7.76582 7.15106C8.00861 7.2517 8.22919 7.39922 8.41494 7.58518C8.55711 7.71766 8.74516 7.78978 8.93946 7.78635C9.13376 7.78292 9.31914 7.70421 9.45656 7.5668C9.59397 7.42938 9.67268 7.244 9.67611 7.0497C9.67954 6.8554 9.60742 6.66735 9.47494 6.52518C9.14993 6.20013 8.76407 5.94229 8.33941 5.76638C7.91475 5.59047 7.45959 5.49992 6.99994 5.49992C6.54028 5.49992 6.08512 5.59047 5.66046 5.76638C5.2358 5.94229 4.84995 6.20013 4.52494 6.52518L2.02494 9.02517C1.36852 9.68159 0.999756 10.5719 0.999756 11.5002C0.999756 12.4285 1.36852 13.3188 2.02494 13.9752C2.68135 14.6316 3.57163 15.0004 4.49994 15.0004C5.42824 15.0004 6.31852 14.6316 6.97494 13.9752L8.22494 12.7252C8.35742 12.583 8.42954 12.395 8.42611 12.2007C8.42268 12.0064 8.34397 11.821 8.20656 11.6836C8.06914 11.5462 7.88376 11.4674 7.68946 11.464C7.49516 11.4606 7.30711 11.5327 7.16494 11.6652L5.91494 12.9152C5.72919 13.1011 5.50861 13.2487 5.26582 13.3493C5.02302 13.45 4.76277 13.5018 4.49994 13.5018C4.2371 13.5018 3.97685 13.45 3.73405 13.3493C3.49126 13.2487 3.27068 13.1011 3.08494 12.9152Z" /></svg>';
icons["video"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.99111 1.35017H2C1.64101 1.35017 1.35 1.64118 1.35 2.00017V14.0002C1.35 14.3592 1.64101 14.6502 2 14.6502H14C14.359 14.6502 14.65 14.3592 14.65 14.0002V5.00129C14.65 5.00092 14.65 5.00054 14.65 5.00017C14.65 4.99979 14.65 4.99942 14.65 4.99904V2.00017C14.65 1.64118 14.359 1.35017 14 1.35017H11.0101C11.0038 1.35007 10.9974 1.35007 10.9911 1.35017H7.01008C7.00375 1.35007 6.99743 1.35007 6.99111 1.35017ZM9.78546 2.65017H7.34787L6.21454 4.35017H8.65213L9.78546 2.65017ZM11.3479 2.65017L10.2145 4.35017H13.35V2.65017H11.3479ZM13.35 5.65017H9.00888C9.00257 5.65026 8.99624 5.65026 8.98992 5.65017H5.00888C5.00257 5.65026 4.99624 5.65026 4.98992 5.65017H2.65V13.3502H13.35V5.65017ZM2.65 4.35017H4.65213L5.78546 2.65017H2.65V4.35017ZM6.50833 6.7499C6.70944 6.63379 6.95722 6.63379 7.15833 6.7499L10.6583 8.77063C10.8594 8.88675 10.9833 9.10133 10.9833 9.33355C10.9833 9.56577 10.8594 9.78035 10.6583 9.89647L7.15833 11.9172C6.95722 12.0333 6.70944 12.0333 6.50833 11.9172C6.30722 11.8011 6.18333 11.5865 6.18333 11.3543V7.31282C6.18333 7.08059 6.30722 6.86601 6.50833 6.7499ZM7.48333 8.43865V10.2284L9.03334 9.33355L7.48333 8.43865Z" fill="#506176"/></svg>';
icons["image"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path d="M13.9999 10V12H15.9999V13.3333H13.9999V15.3333H12.6666V13.3333H10.6666V12H12.6666V10H13.9999ZM14.0053 2C14.3706 2 14.6666 2.29667 14.6666 2.662V8.89467C14.2383 8.7434 13.7874 8.66629 13.3333 8.66667V3.33333H2.66659L2.66725 12.6667L8.86192 6.47133C8.97656 6.35632 9.12926 6.28715 9.29132 6.27684C9.45338 6.26653 9.61363 6.31578 9.74192 6.41533L9.80392 6.472L12.1679 8.83867C11.651 8.99618 11.1714 9.25674 10.7579 9.60464C10.3444 9.95254 10.0057 10.3806 9.76208 10.8629C9.51851 11.3453 9.37514 11.872 9.34062 12.4113C9.3061 12.9505 9.38116 13.4912 9.56125 14.0007L1.99459 14C1.81913 13.9998 1.65092 13.93 1.52691 13.8059C1.40291 13.6817 1.33325 13.5135 1.33325 13.338V2.662C1.33447 2.48692 1.40452 2.31934 1.52826 2.19548C1.652 2.07161 1.81951 2.0014 1.99459 2H14.0053ZM5.33325 4.66667C5.68687 4.66667 6.02601 4.80714 6.27606 5.05719C6.52611 5.30724 6.66658 5.64638 6.66658 6C6.66658 6.35362 6.52611 6.69276 6.27606 6.94281C6.02601 7.19286 5.68687 7.33333 5.33325 7.33333C4.97963 7.33333 4.64049 7.19286 4.39044 6.94281C4.14039 6.69276 3.99992 6.35362 3.99992 6C3.99992 5.64638 4.14039 5.30724 4.39044 5.05719C4.64049 4.80714 4.97963 4.66667 5.33325 4.66667V4.66667Z" /></g><defs><clipPath id="clip0"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>';
icons["blockquote"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.05533 11.5473C2.36867 10.818 2 10 2 8.674C2 6.34067 3.638 4.24933 6.02 3.21533L6.61533 4.134C4.392 5.33667 3.95733 6.89733 3.784 7.88133C4.142 7.696 4.61067 7.63133 5.07 7.674C6.27267 7.78533 7.22067 8.77267 7.22067 10C7.22067 10.6188 6.97483 11.2123 6.53725 11.6499C6.09966 12.0875 5.50617 12.3333 4.88733 12.3333C4.172 12.3333 3.488 12.0067 3.05533 11.5473V11.5473ZM9.722 11.5473C9.03533 10.818 8.66667 10 8.66667 8.674C8.66667 6.34067 10.3047 4.24933 12.6867 3.21533L13.282 4.134C11.0587 5.33667 10.624 6.89733 10.4507 7.88133C10.8087 7.696 11.2773 7.63133 11.7367 7.674C12.9393 7.78533 13.8873 8.77267 13.8873 10C13.8873 10.6188 13.6415 11.2123 13.2039 11.6499C12.7663 12.0875 12.1728 12.3333 11.554 12.3333C10.8387 12.3333 10.1547 12.0067 9.722 11.5473V11.5473Z" /></svg>';
icons["code-block"] =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.71967 3.21967C5.01256 2.92678 5.48744 2.92678 5.78033 3.21967C6.07322 3.51256 6.07322 3.98744 5.78033 4.28033L2.06066 8L5.78033 11.7197C6.07322 12.0126 6.07322 12.4874 5.78033 12.7803C5.48744 13.0732 5.01256 13.0732 4.71967 12.7803L0.46967 8.53033C0.176777 8.23744 0.176777 7.76256 0.46967 7.46967L4.71967 3.21967ZM11.2803 3.21967C10.9874 2.92678 10.5126 2.92678 10.2197 3.21967C9.92678 3.51256 9.92678 3.98744 10.2197 4.28033L13.9393 8L10.2197 11.7197C9.92678 12.0126 9.92678 12.4874 10.2197 12.7803C10.5126 13.0732 10.9874 13.0732 11.2803 12.7803L15.5303 8.53033C15.8232 8.23744 15.8232 7.76256 15.5303 7.46967L11.2803 3.21967Z" /></svg>';
icons["list"] = {
  ordered:
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.00337 2.50005C2.00337 2.32685 1.91375 2.16599 1.76648 2.07484C1.61921 1.9837 1.43526 1.97525 1.28025 2.05252L0.277079 2.55256C0.0299152 2.67576 -0.0705754 2.976 0.0526264 3.22317C0.175828 3.47033 0.476068 3.57082 0.723232 3.44762L1.00328 3.30802V6.00036H0.500155C0.223988 6.00036 0.000110023 6.22424 0.000110023 6.50041C0.000110023 6.77657 0.223988 7.00045 0.500155 7.00045H2.5065C2.78267 7.00045 3.00655 6.77657 3.00655 6.50041C3.00655 6.22424 2.78267 6.00036 2.5065 6.00036H2.00337V2.50005ZM5 3.25C5 2.83579 5.33579 2.5 5.75 2.5H14.25C14.6642 2.5 15 2.83579 15 3.25C15 3.66421 14.6642 4 14.25 4H5.75C5.33579 4 5 3.66421 5 3.25ZM5 8.25C5 7.83579 5.33579 7.5 5.75 7.5H14.25C14.6642 7.5 15 7.83579 15 8.25C15 8.66421 14.6642 9 14.25 9H5.75C5.33579 9 5 8.66421 5 8.25ZM5 13.25C5 12.8358 5.33579 12.5 5.75 12.5H14.25C14.6642 12.5 15 12.8358 15 13.25C15 13.6642 14.6642 14 14.25 14H5.75C5.33579 14 5 13.6642 5 13.25ZM0.924398 10.32L0.927032 10.3161C0.931315 10.3099 0.939805 10.2981 0.952393 10.2825C0.978004 10.2507 1.01787 10.2066 1.07075 10.1628C1.17619 10.0753 1.31709 10.0007 1.50025 10.0007C1.69557 10.0007 1.80717 10.0693 1.87542 10.1467C1.95169 10.2332 2.00312 10.366 2.00312 10.5231C2.00312 10.9755 1.73398 11.2053 1.20308 11.6005L1.16805 11.6265C0.6919 11.9803 0.000122084 12.4944 0.000122084 13.4999C0.000122084 13.6325 0.0528052 13.7597 0.146582 13.8535C0.240359 13.9473 0.367547 14 0.500167 14H2.50309C2.77926 14 3.00321 13.7761 3.00321 13.4999C3.00321 13.2238 2.77933 12.9999 2.50317 12.9999H1.14611C1.27778 12.8026 1.49742 12.6281 1.80025 12.4027L1.84691 12.368C2.31766 12.0188 3.00321 11.5101 3.00321 10.5231C3.00321 10.1578 2.88489 9.77939 2.62556 9.48527C2.35821 9.18206 1.96836 9.00062 1.50027 9.00061C1.02002 9.0006 0.66087 9.20333 0.432114 9.39315C0.317894 9.48793 0.232132 9.58249 0.173885 9.65472C0.144543 9.69111 0.121547 9.72262 0.104827 9.74677C0.0964494 9.75887 0.0895948 9.76919 0.0842568 9.77744L0.0773676 9.78826L0.0747623 9.79245L0.0736683 9.79423L0.072939 9.79543C-0.070366 10.0315 0.00461414 10.3394 0.24069 10.4827C0.47501 10.625 0.779746 10.5519 0.924398 10.32ZM0.500117 10.0552L0.072939 9.79543C0.072939 9.79543 0.0727131 9.7958 0.500117 10.0552Z" /></g><defs><clipPath id="clip0"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>',
  bullet:
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 4C2.55228 4 3 3.55228 3 3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3C1 3.55228 1.44772 4 2 4ZM5.75 2.5C5.33579 2.5 5 2.83579 5 3.25C5 3.66421 5.33579 4 5.75 4H14.25C14.6642 4 15 3.66421 15 3.25C15 2.83579 14.6642 2.5 14.25 2.5H5.75ZM5.75 7.5C5.33579 7.5 5 7.83579 5 8.25C5 8.66421 5.33579 9 5.75 9H14.25C14.6642 9 15 8.66421 15 8.25C15 7.83579 14.6642 7.5 14.25 7.5H5.75ZM5.75 12.5C5.33579 12.5 5 12.8358 5 13.25C5 13.6642 5.33579 14 5.75 14H14.25C14.6642 14 15 13.6642 15 13.25C15 12.8358 14.6642 12.5 14.25 12.5H5.75ZM3 8C3 8.55228 2.55228 9 2 9C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7C2.55228 7 3 7.44772 3 8ZM2 14C2.55228 14 3 13.5523 3 13C3 12.4477 2.55228 12 2 12C1.44772 12 1 12.4477 1 13C1 13.5523 1.44772 14 2 14Z"/></svg>',
};
icons["indent"] = {
  "+1": '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.46362 2.88486C1.46362 2.48381 1.78874 2.15869 2.18979 2.15869H13.8099C14.2109 2.15869 14.536 2.48381 14.536 2.88486C14.536 3.28591 14.2109 3.61103 13.8099 3.61103H2.18979C1.78874 3.61103 1.46362 3.28591 1.46362 2.88486ZM1.46362 13.7774C1.46362 13.3763 1.78874 13.0512 2.18979 13.0512H13.8099C14.2109 13.0512 14.536 13.3763 14.536 13.7774C14.536 14.1784 14.2109 14.5036 13.8099 14.5036H2.18979C1.78874 14.5036 1.46362 14.1784 1.46362 13.7774ZM7.27359 10.1466C7.27359 9.7455 7.59871 9.42038 7.99976 9.42038H13.8099C14.2109 9.42038 14.536 9.7455 14.536 10.1466C14.536 10.5476 14.2109 10.8727 13.8099 10.8727H7.99976C7.59871 10.8727 7.27359 10.5476 7.27359 10.1466ZM7.27359 6.51571C7.27359 6.11465 7.59871 5.78954 7.99976 5.78954H13.8099C14.2109 5.78954 14.536 6.11465 14.536 6.51571C14.536 6.91676 14.2109 7.24188 13.8099 7.24188H7.99976C7.59871 7.24188 7.27359 6.91676 7.27359 6.51571ZM3.86389 7.88955C4.13107 8.12331 4.13107 8.53895 3.86389 8.77271L1.85285 10.5322C1.7011 10.6649 1.46362 10.5572 1.46362 10.3555V6.30671C1.46362 6.10508 1.7011 5.99731 1.85285 6.13008L3.86389 7.88955Z" fill="#696D73"/></svg>',
  "-1": '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.46436 2.88685C1.46436 2.48578 1.78949 2.16064 2.19056 2.16064H13.8099C14.211 2.16064 14.5361 2.48578 14.5361 2.88685C14.5361 3.28793 14.211 3.61306 13.8099 3.61306H2.19056C1.78949 3.61306 1.46436 3.28793 1.46436 2.88685ZM1.46436 13.78C1.46436 13.3789 1.78949 13.0538 2.19056 13.0538H13.8099C14.211 13.0538 14.5361 13.3789 14.5361 13.78C14.5361 14.181 14.211 14.5062 13.8099 14.5062H2.19056C1.78949 14.5062 1.46436 14.181 1.46436 13.78ZM7.27401 10.1489C7.27401 9.74785 7.59915 9.42272 8.00022 9.42272H13.8099C14.211 9.42272 14.5361 9.74785 14.5361 10.1489C14.5361 10.55 14.211 10.8751 13.8099 10.8751H8.00022C7.59915 10.8751 7.27401 10.55 7.27401 10.1489ZM7.27401 6.51789C7.27401 6.11682 7.59915 5.79168 8.00022 5.79168H13.8099C14.211 5.79168 14.5361 6.11682 14.5361 6.51789C14.5361 6.91896 14.211 7.2441 13.8099 7.2441H8.00022C7.59915 7.2441 7.27401 6.91896 7.27401 6.51789ZM1.96911 8.77507C1.7019 8.54125 1.7019 8.12556 1.96911 7.89175L3.97986 6.13234C4.13164 5.99953 4.36918 6.10732 4.36918 6.30901V10.3578C4.36918 10.5595 4.13164 10.6673 3.97986 10.5345L1.96911 8.77507Z" /></svg>',
};
icons["align"] = {
  center:
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2.125 2.1875C1.77983 2.1875 1.5 2.48132 1.5 2.84375C1.5 3.20618 1.77983 3.5 2.125 3.5H11.875C12.2202 3.5 12.5 3.20618 12.5 2.84375C12.5 2.48132 12.2202 2.1875 11.875 2.1875H2.125Z" fill="#696D73"/>\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.625 5C4.27983 5 4 5.29382 4 5.65625C4 6.01868 4.27983 6.3125 4.625 6.3125H9.375C9.72017 6.3125 10 6.01868 10 5.65625C10 5.29382 9.72017 5 9.375 5H4.625Z" fill="#696D73"/>\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.625 11C4.27983 11 4 11.2938 4 11.6562C4 12.0187 4.27983 12.3125 4.625 12.3125H9.375C9.72017 12.3125 10 12.0187 10 11.6562C10 11.2938 9.72017 11 9.375 11H4.625Z" fill="#696D73"/>\n' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M2.125 8C1.77983 8 1.5 8.29382 1.5 8.65625C1.5 9.01868 1.77983 9.3125 2.125 9.3125H11.875C12.2202 9.3125 12.5 9.01868 12.5 8.65625C12.5 8.29382 12.2202 8 11.875 8H2.125Z" fill="#696D73"/>\n' +
    "</svg>",
};

Quill.register("modules/ImageResize", ImageResize);
Quill.register("modules/magicUrl", MagicUrl);

function handlePasteElement(node, delta) {
  delta.ops = delta.ops.filter((op) => !op.insert?.image);
  if (delta?.ops?.length <= 0) {
    return delta;
  }
  //remove color from pasted contents defined by inline-CSS
  delta.ops.forEach((op) => {
    if (op.attributes) {
      delete op?.attributes?.color;
    }
  });
  return delta;
}

function MyReactQuill({
  value,
  onChange,
  onFocus,
  onBlur,
  setModalInsetFunc,
  users = [],
  setQuillRef = null,
  readOnly = false,
}) {
  const defaultModules = useMemo(() => ({
    clipboard: {
      matchers: [[Node.ELEMENT_NODE, handlePasteElement]],
    },
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ align: "center" }],
        ["bold", "italic", "underline", "strike"],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
      ],
      handlers: {
        //must be an async func so you can pass img link from other component later
        image: async function () {
          const that = this;
          new Promise((resolve) => {
            setModalInsetFunc(function () {
              //pass resolve to ImgModal component so it can be called as resolve(link) in ImgModal, see in ImgModal.txs line 84
              return resolve;
            });
          }).then((link) => {
            that.quill.focus();
            var range = that.quill.getSelection();
            that.quill.insertEmbed(range.index, "image", link, "user");
          });
        },
        video: async function () {
          const that = this;
          new Promise((resolve) => {
            setModalInsetFunc(function () {
              //pass resolve to ImgModal component so it can be called as resolve(link) in ImgModal, see in ImgModal.txs line 84
              return resolve;
            }, "video");
          }).then((link) => {
            const videoLink = link?.replace("watch?v=", "embed/");
            that.quill.focus();
            var range = that.quill.getSelection();
            that.quill.insertEmbed(range.index, "video", videoLink, "user");
          });
        },
      },
    },
    ImageResize: {
      modules: ["Resize", "DisplaySize"],
    },
    magicUrl: true,
  }), []);

  const [modules, setModules] = useState(defaultModules);

  useDeepCompareEffect(() => {
    setModules({
      ...defaultModules,
      mention: {
        allowedChars: /^[A-Za-z\s]*$/,
        mentionDenotationChars: ["@"],
        source: function (searchTerm, renderList, mentionChar) {
          const atValues = [];
          users.map((user) => atValues.push({ id: user.value, value: user.name }));

          let values;
          if (mentionChar === "@") {
            values = atValues;
          }
          if (searchTerm.length === 0) {
            renderList(values, searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < values.length; i++) {
              if (
                ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
              ) {
                matches.push(values[i]);
              }
            }
            renderList(matches, searchTerm);
          }
        },
      }
    });
  }, [users, defaultModules]);

  const ref = useRef();

  useEffect(() => {
    setQuillRef && setQuillRef(ref);
  }, [ref, setQuillRef]);

  return (
    <ReactQuill
      ref={ref}
      modules={modules}
      theme="snow"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readOnly}
    />
  );
}

export default MyReactQuill;
