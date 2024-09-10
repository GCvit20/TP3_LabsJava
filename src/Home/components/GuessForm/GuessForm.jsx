import React, { useState, useEffect } from 'react';
import './style.css';

const GuessForm = () => {
  const [numeroIngresado, setNumeroIngresado] = useState('');
  const [numeroSecreto, setNumeroSecreto] = useState(generarNumeroRandom());
  const [pista, setPista] = useState('');
  const [puntaje, setPuntaje] = useState(10);
  const [puntajeAlto, setPuntajeAlto] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tiempo, setTiempo] = useState(20);
  const [puntajeTotal, setPuntajeTotal] = useState(0);


  function generarNumeroRandom() {
    return Math.floor(Math.random() * 20) + 1;
  }

  const handleInputChange = (e) => {
    setNumeroIngresado(e.target.value);
  };

  const getBarColor = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    if (percentage > 75) return '#4caf50'; 
    if (percentage > 50) return '#f4c542'; 
    if (percentage > 25) return '#ff9800'; 
    return '#ff6f6f';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numeroIngresadoValue = Number(numeroIngresado);

    if (numeroIngresadoValue < 1 || numeroIngresadoValue > 20) {
      setPista('El número debe estar entre 1 y 20.');
      return;
    }

    const distance = Math.abs(numeroSecreto - numeroIngresadoValue);
    const maxDistance = 20;

    if (numeroIngresadoValue === numeroSecreto) {
      if (!juegoTerminado) {
        document.body.style.background = 'linear-gradient(to right, #a8e063, #56ab2f)'; 
        setMensaje('¡Felicidades! Has adivinado el número correctamente.');
        setPuntajeAlto(prevPuntajeAlto => Math.max(prevPuntajeAlto, puntaje));
        setPuntajeTotal(prevPuntajeTotal => prevPuntajeTotal + puntaje);
        setPuntaje(10);
        setTimeout(() => {
          document.body.style.background = ''; 
          setMensaje(''); 
        }, 2000);
        reiniciarJuego(); 
      }
    } else {
      const nuevoPuntaje = puntaje - 1;
      if (nuevoPuntaje <= 0) {
        if (!juegoTerminado) {
          document.body.style.background = 'linear-gradient(to right, #ff6f6f, #ff3f3f)';
          setMensaje('¡Juego terminado! Tu puntaje más alto fue: ' + puntajeAlto);
          setJuegoTerminado(true);
          setTimeout(() => {
            document.body.style.background = ''; 
            setMensaje('');
          }, 2000);
        }
      } else {
        setPuntaje(nuevoPuntaje);
        setPista(numeroIngresadoValue < numeroSecreto ? 'El número es mayor.' : 'El número es menor.');
        setMensaje('');
      }
    }

    const progressPercentage = ((maxDistance - distance) / maxDistance) * 100;
    setProgress(progressPercentage);

    setNumeroIngresado('');
  };

  const reiniciarJuego = () => {
    setNumeroIngresado('');
    setPista('');
    setNumeroSecreto(generarNumeroRandom());
    setProgress(0);
    setTiempo(20);
  };

  const handleReiniciarJuego = () => {
    setPuntaje(10);
    setPuntajeTotal(0);
    setPuntajeAlto(0);
    setJuegoTerminado(false);
    reiniciarJuego();
    setMensaje('');
  };

  useEffect(() => {
    let interval = null;
    if (!juegoTerminado && tiempo > 0) {
      interval = setInterval(() => setTiempo(tiempo => tiempo - 1), 1000);
    } else if (tiempo === 0) {
      if (!juegoTerminado) {
        setMensaje('¡Tiempo terminado! El número secreto era: ' + numeroSecreto);
        document.body.style.background = 'linear-gradient(to right, #ff6f6f, #ff3f3f)';
        setJuegoTerminado(true);
        setTimeout(() => {
          document.body.style.background = ''; 
          setMensaje('');
        }, 2000);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [juegoTerminado, tiempo]);

  return (
    <div>
      <div className='top-right'>
        <button onClick={handleReiniciarJuego} className='btn btn-primary btn-reiniciar'>Reiniciar</button>
      </div>
  
      <div className='container'>
        {juegoTerminado ? (
          <div>
            <h1 className='text-center'>Juego Terminado</h1>
            <p className='text-center mensajePerdedor'>¡Perdiste! Tu puntaje más alto fue: {puntajeAlto}</p>
          </div>
        ) : (
          <div>
            <h1 className='text-center'>Bienvenido</h1>
            <h2 className='text-center'>¿Listo para adivinar el número del 1-20?</h2>
            <form onSubmit={handleSubmit}>
              <input
                className='cajaNumerica'
                type="number"
                value={numeroIngresado}
                onChange={handleInputChange}
                min="1"
                max="20"
                placeholder="Adivina el número"
              />
              <button type="submit" className='btn btn-primary btn-adivinanza'>Adivinar</button>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(juegoTerminado || tiempo === 0 ? progress : (tiempo / 20) * 100)}%`,
                    backgroundColor: getBarColor(tiempo, 20)
                  }}
                ></div>
              </div>
            </form>
            {pista && (
              <p className='pista'>{pista}</p>
            )}
            {mensaje && (
              <p className='mensaje'>{mensaje}</p>
            )}
            <div className='text-center'>
              <p>Puntaje: {puntaje}</p>
              <p>Puntaje Total: {puntajeTotal}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessForm;