const loadIssues = () => {
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

    fetch(url).then((response) => response.json()).then((json) => {
        fillIssues(json);
    });
}

const btnAll = document.getElementById('btn-all');
const btnOpen = document.getElementById('btn-open');
const btnClosed = document.getElementById('btn-closed');

const issuesCountText = document.getElementById('issues-count');

let activeTab = btnAll;

const tabBtnList = [btnAll, btnOpen, btnClosed];

const showCount = (openIssueCount, closedIssueCount) => {
    if (activeTab === tabBtnList[0]) {
        issuesCountText.textContent = `${openIssueCount + closedIssueCount}`;
    }
    else if (activeTab === tabBtnList[1]) {
        issuesCountText.textContent = openIssueCount;
    }
    else if ((activeTab === tabBtnList[2])) {
        issuesCountText.textContent = closedIssueCount;
    }

    // console.log(openIssueCount);
}

const fillIssues = (json) => {
    const issuesContainer = document.getElementById('issues-container');
    issuesContainer.innerHTML = '';

    let openIssueCount = 0;
    let closedIssueCount = 0;

    json.data.forEach((issue) => {

        // console.log(activeTab.id, `btn-${issue.status}`);

        if (activeTab != btnAll && !(activeTab.id === `btn-${issue.status}`)) {
            return;
        }

        const issueDiv = document.createElement('div');

        issueDiv.className = 'p-4 pb-20 bg-white shadow-md rounded border-t-3 relative';

        if (issue.status === 'open') {
            issueDiv.classList.add('border-[#00A96E]');
            openIssueCount++;
        }
        else if (issue.status === 'closed') {
            issueDiv.classList.add('border-[#A855F7]');
            closedIssueCount++;
        }

        showCount(openIssueCount, closedIssueCount);

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

            <hr class="border-t border-[#E4E4E7] absolute bottom-16 left-0 right-0">

            <p class="text-xs text-[#64748B] absolute bottom-10">#<span>${issue.id}</span> by <span>${issue.author}</span></p>

            <p class="text-xs text-[#64748B] absolute bottom-4">${new Date(issue.createdAt).toLocaleDateString('en-US')}</p>

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
                    // console.log(label, arrLabel);

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

document.getElementById('tab-btns').addEventListener('click', (event) => {
    tabBtnList.forEach((tabBtn) => {
        if (tabBtn === event.target) {
            tabBtn.classList.add('active');

            activeTab = tabBtn;

            loadIssues();

            return;
        }

        tabBtn.classList.remove('active');
    })
});

