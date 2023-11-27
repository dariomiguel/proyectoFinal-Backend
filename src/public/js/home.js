document.querySelector("#btnPrev").onclick = () => {
    const prevPage = document.querySelector("#prevPage").value;
    const limit = document.querySelector("#limit").value;

    const url = `/?page=${prevPage}&limit=${limit}`;

    document.location.href = url;
}

document.querySelector("#btnNext").onclick = () => {
    const nextPage = document.querySelector("#nextPage").value;
    const limit = document.querySelector("#limit").value;

    const url = `/?page=${nextPage}&limit=${limit}`;

    document.location.href = url;
}