// pages/index.js
"use client";

// pages/index.js

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const fetchRandomPokemon = async () => {
  const index = Math.floor(Math.random() * 898 + 1); // ポケモンの総数に合わせて調整
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
  const result = await res.json();
  return result;
};

const IndexPage = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [stats, setStats] = useState({});
  const [userMessage, setUserMessage] = useState("");
  const [pokemonImage, setPokemonImage] = useState("");
  const [showImage, setShowImage] = useState(false); // 画像表示フラグ

  const startGame = async () => {
    try {
      const pokemon = await fetchRandomPokemon();
      setPokemonName(pokemon.name);
      setStats(pokemon.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
      }, {}));
      setPokemonImage(pokemon.sprites.front_default);
      setUserMessage(""); // ゲームスタート時にエラーメッセージをクリア
      setShowImage(false); // 画像非表示
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleGuess = (event) => {
    event.preventDefault();
    const userGuess = event.target.elements.guess.value.toLowerCase();
    if (userGuess === pokemonName.toLowerCase()) {
      alert("正解！");
      startGame(); // 新しいポケモンの種族値を表示
    } else {
      setUserMessage(`正解は ${pokemonName} でした`); // 不正解時に正答を表示
    }
    setShowImage(true); // 画像表示
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="container">
      <h1>ポケモン種族値当てゲーム</h1>
      <p>以下の種族値のポケモンの名前を、以下の欄に英語表記で記入してください。</p>
      <p>種族値: {JSON.stringify(stats)}</p>
      {showImage && <img src={pokemonImage} alt={pokemonName} className="img-fluid" />} {/* ポケモンの画像を表示 */}
      <form onSubmit={handleGuess}>
        <input type="text" name="guess" placeholder="ポケモンの名前を入力" />
        <button type="submit">答える</button>
      </form>
      <button onClick={startGame} className="btn btn-primary">ゲームスタート</button>
      <p style={{ color: "red" }}>{userMessage}</p>
    </div>
  );
};

export default IndexPage;
