async function getCandidates() {
  const response = await fetch("/candidate.data.json");
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error("Failed to get candidates!");
}

function filterByAge(candidate) {
  const targetDate = new Date()
  const thisYear = targetDate.getFullYear()
  targetDate.setUTCFullYear(thisYear - 18)
  return new Date(candidate.dob) < targetDate
}

function applyAgeRestriction(candidates) {
  return candidates.filter(filterByAge)
}

function applyCVRestriction(candidates) {
  return candidates.filter((candidate) => Boolean(candidate.cvURL))
}

function applyRestrictions(candidates) {
  const restrictions = [
    applyCVRestriction,
    applyAgeRestriction
  ];

  for (let restriction of restrictions) {
    candidates = restriction(candidates)
  }

  return candidates
}

function findAllCSSPeople(candidates) {
  return candidates.filter((candidate) => {
    return candidate.skills.includes("CSS")
  })
}

function lookupPerson(query, candidates) {
  return candidates.find((candidate) => candidate.name.includes(query))
}

function advancedLookup(queryFunction, candidates) {
  return candidates.find(queryFunction)
}

function sortByAge(a, b) {
  a = new Date(a.dob)
  b = new Date(b.dob)

  if (a < b) {
    return 1
  }

  if (b < a) {
    return -1
  }

  return 0
}

function sortBySkills(a, b) {
  a = a.skills.length;
  b = b.skills.length;

  return b - a;
}

function createSkillsSummary(candidates) {
  const listOfSkills = candidates.reduce((allSkills, candidate) => {
    allSkills.push(candidate.skills)
    return allSkills
  }, []).flatMap(item => item)

  const setOfSkills = Array.from(new Set(listOfSkills))
  return setOfSkills
}

async function app() {
  try {
    const candidates = await getCandidates();
    window.candidates = candidates;
    console.log('All applicants:',candidates);

    const roundOne = applyRestrictions(candidates);
    console.log('Round One:',roundOne);

    const roundTwo = findAllCSSPeople(roundOne);
    console.log('Round Two:',roundTwo);

    const sortedBySkills = candidates.sort(sortBySkills)
    console.log(sortedBySkills);

    const allSkills = createSkillsSummary(roundTwo);
    console.log(allSkills);
  } catch (e) {
    console.warn(e)
    alert(e)
  }
}

app()