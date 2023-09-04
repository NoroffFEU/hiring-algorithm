async function getCandidates() {
  const response = await fetch("/candidate.data.json");
  const data = await response.json()

  if (response.ok) {
    return data
  }

  throw new Error("Failed to get candidates!");
}

function applyAgeRestriction(candidates) {
  let passingCandidates = [];

  const targetDate = new Date()
  const thisYear = targetDate.getFullYear()
  targetDate.setUTCFullYear(thisYear - 18)

  for (candidate of candidates) {
    const dob = new Date(candidate.dob);
    if (dob < targetDate) {
      passingCandidates.push(candidate);
    }
  }

  return passingCandidates;
}

function applyCVRestriction(candidates) {
  let passingCandidates = [];

  for (candidate of candidates) {
    for (key in candidate) {
      if (key === "cvURL") {
        passingCandidates.push(candidate);
        break;
      }
    }
  }

  return passingCandidates;
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
  const passingCandidates = []

  for (let candidate of candidates) {
    for (let skill of candidate.skills) {
      if (skill !== "CSS") {
        continue;
      }

      passingCandidates.push(candidate)
    }
  }

  return passingCandidates;
}

async function app() {
  try {
    const candidates = await getCandidates();
    console.log('All applicants:',candidates);

    const roundOne = applyRestrictions(candidates);
    console.log('Round One:',roundOne);

    const roundTwo = findAllCSSPeople(roundOne);
    console.log('Round Two:',roundTwo);
    // Find each candidate interested in CSS

  } catch (e) {
    console.warn(e)
    alert(e)
  }
}

app()