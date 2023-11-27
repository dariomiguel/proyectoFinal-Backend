document.querySelector("#btnPrev").onclick = () => {
    const prevPage = document.querySelector("#prevPage").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;

    const url = `/?page=${prevPage}&limit=${limit}&query=${query}`;

    document.location.href = url;
}

document.querySelector("#btnNext").onclick = () => {
    const nextPage = document.querySelector("#nextPage").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;

    const url = `/?page=${nextPage}&limit=${limit}&query=${query}`;

    document.location.href = url;
}

document.querySelector("#btnSearch").onclick = () => {
    const nextPage = document.querySelector("#page").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;

    const url = `/?page=${nextPage}&limit=${limit}&query=${query}`;

    document.location.href = url;
}