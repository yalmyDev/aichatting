$(document).ready(function () {
    // [start]gsap library 활용 애니메이션
    gsap.set(".step01, .step02", { height: 0, opacity: 0, overflow: "hidden" });
    let tl = gsap.timeline({ delay: 0.3 });

    tl.to(".step01", {
        duration: 0.4,
        height: "auto",
        ease: "none",
    })
        .to(".step01", {
            duration: 0.8,
            opacity: 1,
            ease: "none",
        })
        .to(
            ".step02",
            {
                duration: 0.4,
                height: "auto",
                ease: "none",
            },
            "+=0.3",
        )
        .to(".step02", {
            duration: 0.8,
            opacity: 1,
            ease: "none",
        })
        .to(
            ".step03",
            {
                duration: 0.8,
                opacity: 1,
                ease: "none",
            },
            "+=0.3",
        )
        .from(
            ".step04",
            {
                duration: 0.3,
                clipPath: "inset(0 0 100% 0)",
                ease: "none",
            },
            "+=0.3",
        )
        .from(
            ".step04",
            {
                duration: 0.8,
                opacity: 0,
                ease: "none",
            },
            "<",
        )
        .from(
            ".step05",
            {
                duration: 0.3,
                clipPath: "inset(0 0 100% 0)",
                ease: "none",
            },
            "+=0.3",
        )
        .from(
            ".step05",
            {
                duration: 0.8,
                opacity: 0,
                ease: "none",
            },
            "<",
        );

    // [end]gsap library 활용 애니메이션

    // [start]화면 전환 애니메이션
    $();
    // [end]화면 전환 애니메이션
});
