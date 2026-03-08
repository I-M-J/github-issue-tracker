const loadIssues = () => {
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

    fetch(url).then((response) => response.json()).then((json) => {
        fillIssues(json);
    });
}

const fillIssues = (json) => {
    const issuesContainer = document.getElementById('issues-container');
    issuesContainer.innerHTML = '';

    json.data.forEach((issue) => {
        const issueDiv = document.createElement('div');

        issueDiv.className = 'p-4 bg-white shadow-md rounded border-t-3';

        (issue.status === 'open') ? issueDiv.classList.add('border-[#00A96E]') : issueDiv.classList.add('border-[#A855F7]');

        issueDiv.innerHTML = `
            <div class="flex justify-between items-center mb-3">

                ${(issue.status === 'open') ? '<img src="assets/Open-Status.png" alt="">' : '<img src="assets/Closed- Status .png" alt="">'}

                <div class="h-6 w-20 rounded-[100px] text-xs font font-medium grid place-items-center ${issue.priority}">${issue.priority.toUpperCase()}</div>
            </div>

            <h2 class="font-semibold text-sm mb-8">${issue.title}</h2>

            <p class="font-normal text-xs text-[#64748B] mb-3">${issue.description}</p>

            <div class="flex flex-wrap gap-1 mb-4">
                ${addLabels()}
            </div>

            <hr class="-mx-4 mb-4 border-t-1 border-[#E4E4E7]">

            <p class="text-xs text-[#64748B] mb-2">#<span>1</span> by <span>john_doe</span></p>

            <p class="text-xs text-[#64748B]">1/15/2024</p>
        `;

        issuesContainer.append(issueDiv);

        function addLabels() {
            let allLabels = '';

            const className = 'px-2 py-1.5 rounded-[100px] inline-block text-xs font-medium';

            const icons = [
                '<i class="fa-solid fa-bug"></i>',
                '<i class="fa-regular fa-life-ring"></i>',
                '<i class="fa-solid fa-wand-magic-sparkles"></i>',
            ];

            const classLabels = ['bug', 'help', 'enhance'];

            issue.labels.forEach((label) => {

                let labelDiv = ``;

                for (const arrLabel of classLabels) {
                    console.log(label, arrLabel);

                    if (label.includes(arrLabel)) {
                        labelDiv = `<div class="${className} ${arrLabel}">${icons[classLabels.indexOf(arrLabel)]} ${label.toUpperCase()}</div>`;
                        break;
                    }
                    else {
                        labelDiv = `<div class="${className} norm"> ${label.toUpperCase()}</div>`;
                    }
                };
                     
                allLabels += labelDiv;
            });

            return allLabels;
        }

    });
}


loadIssues();