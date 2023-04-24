import React, { LegacyRef, useEffect, useRef } from "react";
import { TUser } from "../types";
import { Style, createAvatar } from "@dicebear/core";
import {
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  bottts,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  identicon,
  initials,
  lorelei,
  loreleiNeutral,
  micah,
  miniavs,
  notionists,
  notionistsNeutral,
  openPeeps,
  personas,
  pixelArt,
  pixelArtNeutral,
  shapes,
  thumbs,
} from "@dicebear/collection";

const Avatar = ( user :  TUser ) => {
  const styles: Style<{}>[] = [
    adventurer,
    adventurerNeutral,
    avataaars,
    avataaarsNeutral,
    bigEars,
    bigEarsNeutral,
    bigSmile,
    bottts,
    botttsNeutral,
    croodles,
    croodlesNeutral,
    funEmoji,
    thumbs,
    icons,
    identicon,
    initials,
    lorelei,
    loreleiNeutral,
    micah,
    miniavs,
    notionists,
    notionistsNeutral,
    openPeeps,
    personas,
    pixelArt,
    pixelArtNeutral,
    shapes,
  ];
  const divRef = useRef(null)
  useEffect(() => {
    const avatar = createAvatar(styles[user.id % styles.length], {
      seed: user.username,
    });
    const svg = avatar.toString()
    const div = divRef.current as LegacyRef<HTMLDivElement>
    if(div!==null){
      div.innerHTML = svg 
    }
  }, [])
  return (
    <div className="avatar" ref={divRef} />
  );
};

export default Avatar;
