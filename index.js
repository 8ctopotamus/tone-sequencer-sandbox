// const notes = Array.apply(64).fill('')
let bpm = 100
let isPlaying = false
let beat = 0

const synths = [
  new Tone.Synth().toDestination(),
  new Tone.Synth().toDestination(),
  new Tone.Synth().toDestination(),
  new Tone.Synth().toDestination()
]

const scaleOfNotes = ['C4', 'D4', 'Eb4', 'F4']

let rows = [
  Array.from({ length: 16 }, (_, i) => ({ note: scaleOfNotes[3], active: false  })),
  Array.from({ length: 16 }, (_, i) => ({ note: scaleOfNotes[2], active: false  })),
  Array.from({ length: 16 }, (_, i) => ({ note: scaleOfNotes[1], active: false  })),
  Array.from({ length: 16 }, (_, i) => ({ note: scaleOfNotes[0], active: false  })),
]

// const drawActive = (beat) => {
//   rows.forEach((row, idx) => {
//     if 
//   })
// }

Tone.Transport.scheduleRepeat(time => {
  rows.forEach((row, idx) => {
    let synth = synths[idx]
    let note = row[beat]
    if (note.active) synth.triggerAttackRelease(note.note, "8n", time)
  })
  beat = (beat + 1) % 16
  Tone.Draw.schedule(() => drawActive(beat), time)
}, '16n')

const play = () => {
  if (!isPlaying) {
    Tone.start()
    Tone.Transport.bpm.value = bpm
    Tone.Transport.start()
    isPlaying = true
  }
}

const stop = () =>  {
  isPlaying = false
  Tone.Transport.stop()
  synths.forEach(synth => synth.oscillator.stop())
}

document.getElementById('play/stop').addEventListener('click', () => {
  if (!isPlaying) play()
  else stop()
})

document.getElementById('bpm').addEventListener('change', e => {
  bpm = +e.target.value
  Tone.Transport.bpm.value = bpm
})

const handleToggleNoteActive = (target, i, j) => {
  rows[i][j].active = !rows[i][j].active
  if (rows[i][j].active) {
    target.classList.add('active')
  } else {
    target.classList.remove('active')
  }
}

// init - generate the grid
rows.forEach((row, i) => {
  const div = document.createElement('div')
  div.classList.add('row')
  row.forEach((col, j) => {
    const btn = document.createElement('button')
    btn.addEventListener('click', e => handleToggleNoteActive(e.target, i, j))
    div.appendChild(btn)
  })
  document.getElementById('grid').appendChild(div)
})