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

const issueModal = document.getElementById('issueModal');
const issueDetails = document.getElementById('issue-details');

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

const switchActiveTab = (eventTarget) => {
    tabBtnList.forEach((tabBtn) => {
        if (tabBtn === eventTarget) {
            tabBtn.classList.add('active');

            activeTab = tabBtn;

            loadIssues();

            return;
        }

        tabBtn.classList.remove('active');
    })
}

const fillIssues = (json) => {
    const issuesContainer = document.getElementById('issues-container');
    issuesContainer.innerHTML = '';

    let openIssueCount = 0;
    let closedIssueCount = 0;

    if (json.data.length === 0) {
        showCount(openIssueCount, closedIssueCount);

        return;
    }
    json.data.forEach((issue) => {

        console.log(issue);

        // console.log(activeTab.id, `btn-${issue.status}`);

        if (activeTab != btnAll && !(activeTab.id === `btn-${issue.status}`)) {
            return;
        }

        const issueDiv = document.createElement('div');

        issueDiv.className = 'p-4 pb-20 bg-white shadow-md rounded border-t-3 relative issue-div';

        if (issue.status === 'open') {
            issueDiv.classList.add('border-[#00A96E]');
            openIssueCount++;
        }
        else if (issue.status === 'closed') {
            issueDiv.classList.add('border-[#A855F7]');
            closedIssueCount++;
        }

        console.log(openIssueCount, closedIssueCount);

        issueDiv.innerHTML = `
            <div class="flex justify-between items-center mb-3">

                ${(issue.status === 'open') ? '<img src="assets/Open-Status.png" alt="">' : '<img src="assets/Closed- Status .png" alt="">'}

                <div class="h-6 w-20 rounded-[100px] text-xs font font-medium grid place-items-center ${issue.priority}">${issue.priority.toUpperCase()}</div>
            </div>

            <h2 class="font-semibold text-sm mb-8">${issue.title}</h2>

            <p class="font-normal text-xs text-[#64748B] mb-3">${issue.description}</p>

            <div class="flex flex-wrap gap-1 mb-4">
                ${addLabels(issue.labels)}
            </div>

            <hr class="border-t border-[#E4E4E7] absolute bottom-16 left-0 right-0">

            <p class="text-xs text-[#64748B] absolute bottom-10">#<span class="issue-id">${issue.id}</span> by <span>${issue.author}</span></p>

            <p class="text-xs text-[#64748B] absolute bottom-4">${new Date(issue.createdAt).toLocaleDateString('en-US')}</p>

        `;

        issuesContainer.append(issueDiv);

        showCount(openIssueCount, closedIssueCount);

    });
}

function addLabels(issueLabels) {
    let allLabels = '';

    const className = 'px-2 py-1.5 rounded-[100px] inline-block text-xs font-medium';

    const icons = [
        '<i class="fa-solid fa-bug"></i>',
        '<i class="fa-regular fa-life-ring"></i>',
        '<i class="fa-solid fa-wand-magic-sparkles"></i>',
    ];

    const classLabels = ['bug', 'help', 'enhance'];

    issueLabels.forEach((label) => {

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

const inputSearch = document.getElementById('input-search');

const searchIssues = () => {
    const inputSearchValue = inputSearch.value;

    activeTab = btnAll;

    switchActiveTab(activeTab);

    url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputSearchValue}`;

    fetch(url).then((response) => response.json()).then((json) => {
        fillIssues(json);
    });

}

loadIssues();

document.getElementById('tab-btns').addEventListener('click', (event) => {
    switchActiveTab(event.target);

    inputSearch.value = '';
});

const createModal = (issueData) => {
    issueDetails.innerHTML = `
        <div>
            <h2 class="font-bold text-2xl text-[#1F2937] mb-2">${issueData.title}</h2>

            <div class="flex items-center gap-1">
                <p class="inline-block px-2 py-1.5 font-medium text-xs rounded-[100px] details-${issueData.status}">${issueData.status[0].toUpperCase() + issueData.status.slice(1)}
                </p>

                <ul class="flex items-center gap-1">
                    <li class="flex items-center gap-1 text-xs text-[#64748B]"><span
                            class="text-xl">&#8226;</span>Opened by<span>${issueData.author}</span></li>
                    <li class="flex items-center gap-1 text-xs text-[#64748B]"><span
                            class="text-xl">&#8226;</span><span>${new Date(issueData.createdAt).toLocaleDateString()}</span></li>
                </ul>
            </div>
        </div>
            
        <div class="flex flex-wrap gap-1">
            ${addLabels(issueData.labels)}
        </div>

        <p class="text-[#64748B]">${issueData.description}</p>

        <div class="flex items-center justify-between p-4 bg-[#F8FAFC]">
            <div class="flex-1">
                <h3 class="text-[#64748B] mb-1">Assignee:</h3>

                <p class="font-semibold text-[#1F2937]">${(issueData.assignee) ? issueData.assignee : 'None'}</p>
            </div>

            <div class="flex-1">
                <h3 class="text-[#64748B] mb-1">Priority:</h3>
                <div class="h-6 w-20 rounded-[100px] text-xs font font-medium grid place-items-center ${issueData.priority}">${issueData.priority.toUpperCase()}</div>
            </div>
        </div>
    `
}

document.getElementById('issues-container').addEventListener('click', (event) => {
    const issueDiv = event.target.closest('.issue-div');

    if (!issueDiv) return;

    issueModal.showModal();

    issueDetails.innerHTML = `
        <div id="loading" class="flex items-center justify-center py-30">
            <span class="loading loading-dots loading-xl"></span>
        </div>
    `

    const issueId = issueDiv.querySelector('.issue-id').textContent;

    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`;

    fetch(url).then((response) => response.json()).then((json) => {
        createModal(json.data);
    });
});
