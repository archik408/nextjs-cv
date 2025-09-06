'use client';

import React from 'react';

interface TechIconProps {
  name: string;
  size?: number;
}

export function TechIcon({ name, size = 20 }: TechIconProps) {
  const techIcons: Record<string, React.JSX.Element> = {
    // Frontend Technologies
    JavaScript: (
      <div
        className={`w-${size / 4} h-${size / 4} bg-yellow-400 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-black font-bold text-xs">JS</span>
      </div>
    ),
    TypeScript: (
      <div
        className={`bg-blue-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">TS</span>
      </div>
    ),
    React: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <title>React.js Logo</title>
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="3"
          stroke="#61DAFB"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="8"
          ry="3"
          stroke="#61DAFB"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(-60 12 12)"
        />
      </svg>
    ),
    'Next.js (SSR/SSG/ISR)': (
      <div
        className={`bg-black rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">N</span>
      </div>
    ),
    HTML5: (
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <title>HTML5 Logo</title>
        <path d="M108.4 0h23v22.8h21.2V0h23v69h-23V46h-21v23h-23.2M206 23h-20.3V0h63.7v23H229v46h-23M259.5 0h24.1l14.8 24.3L313.2 0h24.1v69h-23V34.8l-16.1 24.8l-16.1-24.8v34.2h-22.6M348.7 0h23v46.2h32.6V69h-55.6" />
        <path fill="#e44d26" d="M107.6 471l-33-370.4h362.8l-33 370.2L255.7 512" />
        <path fill="#f16529" d="M256 480.5V131H404.3L376 447" />
        <path
          fill="#ebebeb"
          d="M142 176.3h114v45.4h-64.2l4.2 46.5h60v45.3H154.4M156.4 336.3H202l3.2 36.3 50.8 13.6v47.4l-93.2-26"
        />
        <path
          fill="#fff"
          d="M369.6 176.3H255.8v45.4h109.6M361.3 268.2H255.8v45.4h56l-5.3 59-50.7 13.6v47.2l93-25.8"
        />
      </svg>
    ),
    CSS3: (
      <svg
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 362.73401 511.99998"
        id="svg3476"
        version="1.1"
      >
        <title>CSS3 Logo</title>
        <g id="layer1" transform="translate(-193.633,-276.3622)">
          <g id="g3013" transform="translate(119,276.3622)">
            <polygon
              id="polygon2989"
              points="437.367,100.62 404.321,470.819 255.778,512 107.644,470.877 74.633,100.62 "
              fill="#264de4"
            />
            <polygon
              id="polygon2991"
              points="376.03,447.246 404.27,130.894 256,130.894 256,480.523 "
              fill="#2965f1"
            />
            <polygon
              id="polygon2993"
              points="150.31,268.217 154.38,313.627 256,313.627 256,268.217 "
              fill="#ebebeb"
            />
            <polygon
              id="polygon2995"
              points="256,176.305 255.843,176.305 142.132,176.305 146.26,221.716 256,221.716 "
              fill="#ebebeb"
            />
            <polygon
              id="polygon2997"
              points="256,433.399 256,386.153 255.801,386.206 205.227,372.55 201.994,336.333 177.419,336.333 156.409,336.333 162.771,407.634 255.791,433.457 "
              fill="#ebebeb"
            />
            <path id="path2999" d="m 160,0 55,0 0,23 -32,0 0,23 32,0 0,23 -55,0 z" />
            <path
              id="path3001"
              d="m 226,0 55,0 0,20 -32,0 0,4 32,0 0,46 -55,0 0,-21 32,0 0,-4 -32,0 z"
            />
            <path
              id="path3003"
              d="m 292,0 55,0 0,20 -32,0 0,4 32,0 0,46 -55,0 0,-21 32,0 0,-4 -32,0 z"
            />
            <polygon
              id="polygon3005"
              points="311.761,313.627 306.49,372.521 255.843,386.191 255.843,433.435 348.937,407.634 349.62,399.962 360.291,280.411 361.399,268.217 369.597,176.305 255.843,176.305 255.843,221.716 319.831,221.716 315.699,268.217 255.843,268.217 255.843,313.627 "
              fill="#ffffff"
            />
          </g>
        </g>
      </svg>
    ),
    'Lit / Web Components': (
      <svg width={size} height={size} viewBox="0 0 160 200">
        <title>Lit Logo</title>
        <path fill="#00e8ff" d="M40 120l20-60l90 90l-30 50l-40-40h-20" />
        <path fill="#283198" d="M80 160 L80 80 L120 40 L 120 120 M0 160 L40 200 L40 120 L20 120" />
        <path fill="#324fff" d="M40 120v-80l40-40v80M120 200v-80l40-40v80M0 160v-80l40 40" />
        <path fill="#0ff" d="M40 200v-80l40 40" />
      </svg>
    ),
    'Node.js / Express': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#339933">
        <title>Node.js Logo</title>
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l7.44 4.3c.48.28 1.08.28 1.56 0l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2z" />
      </svg>
    ),
    'Python / Django': (
      <svg width={size} height={size} viewBox="0 0 512 512">
        <title>Python Logo</title>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g fill="#5a9fd4">
            <path
              id="p"
              d="M254 64c-16 0-31 1-44 4-39 7-46 21-46 47v35h92v12H130c-27 0-50 16-58 46-8 35-8 57 0 93 7 28 23 47 49 47h32v-42c0-30 26-57 57-57h91c26 0 46-21 46-46v-88c0-24-21-43-46-47-15-3-32-4-47-4zm-50 28c10 0 17 8 17 18 0 9-7 17-17 17-9 0-17-8-17-17 0-10 8-18 17-18z"
            ></path>
          </g>
          <use href="#p" fill="#ffd43b" transform="rotate(180,256,255)"></use>
        </g>
      </svg>
    ),
    'Rust / WebAssembly': (
      <div
        className={`bg-indigo-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🦀</span>
      </div>
    ),
    'PWA / Service Workers': (
      <div
        className={`bg-purple-500 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">📱</span>
      </div>
    ),
    GraphQL: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#E10098">
        <title>GraphQL Logo</title>
        <path d="M12.002 0a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm8.54 4.931a2.138 2.138 0 1 0-1.851 3.207 2.138 2.138 0 0 0 1.851-3.207zm-1.851 10.76a2.138 2.138 0 1 0-1.851-3.207 2.138 2.138 0 0 0 1.851 3.207zm-13.378 0a2.138 2.138 0 1 0 1.851-3.207 2.138 2.138 0 0 0-1.851 3.207zm1.851-10.76A2.138 2.138 0 1 0 5.313 8.138 2.138 2.138 0 0 0 7.164 4.931zm4.838 14.793a2.138 2.138 0 1 0 0-4.277 2.138 2.138 0 0 0 0 4.277z" />
      </svg>
    ),
    'UI/UX Design': (
      <div
        className={`bg-pink-500 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🎨</span>
      </div>
    ),
    'Frontend Architecture': (
      <div
        className={`bg-indigo-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🏗️</span>
      </div>
    ),
    'Design Systems': (
      <div
        className={`bg-green-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">📐</span>
      </div>
    ),
    'Material UI': (
      <div
        className={`bg-blue-500 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">M</span>
      </div>
    ),
    'Micro‑frontends': (
      <svg
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <title>Webpack Logo</title>
        <path
          d="M826.709333 682.154667l-328.874666 189.866666-328.917334-189.866666v-379.733334l328.917334-189.909333 328.874666 189.866667z"
          fill="#FFFFFF"
          fillOpacity=".785"
        />
        <path
          d="M524.202667 84.48c-8.96 0-17.493333 2.517333-24.32 7.637333l-337.066667 189.44c-13.653333 7.253333-22.613333 21.333333-22.613333 37.546667v384c0 16.213333 8.96 30.336 22.613333 37.589333l337.066667 189.44c6.826667 5.12 15.36 7.68 24.32 7.68s17.493333-2.56 24.32-7.68l337.066666-189.44c13.653333-7.253333 22.613333-21.333333 22.613334-37.546666v-384c0-16.213333-8.96-30.378667-22.613334-37.632l-337.066666-189.44a40.32 40.32 0 0 0-24.32-7.637334z m0 91.733333l298.666666 168.106667v89.728h-0.682666v220.885333h0.682666v23.04l-298.666666 168.064-298.666667-168.106666V344.32l298.666667-168.106667z m0 88.746667l-209.066667 120.746667 209.066667 120.746666 209.066666-120.746666-209.066666-120.746667z m-213.333334 216.746667v152.746666l170.666667 98.517334v-152.746667l-170.666667-98.56z m426.666667 0l-170.666667 98.474666v152.746667l170.666667-98.474667v-152.746666z"
          fill="#8ED6FB"
        />
        <path
          d="M524.202667 264.96l-209.066667 120.746667 209.066667 120.746666 209.066666-120.746666-209.066666-120.746667z m-213.333334 216.746667v152.746666l170.666667 98.517334v-152.746667l-170.666667-98.56z m426.666667 0l-170.666667 98.474666v152.746667l170.666667-98.474667v-152.746666z"
          fill="#1C78C0"
        />
      </svg>
    ),
    'Web Performance': (
      <div
        className={`bg-red-500 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">⚡</span>
      </div>
    ),
    'Accessibility (WCAG)': (
      <div
        className={`bg-blue-700 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">♿</span>
      </div>
    ),
    'RWD / Mobile-First': (
      <div
        className={`bg-purple-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">📱</span>
      </div>
    ),
    'HTTP / REST': (
      <div
        className={`bg-gray-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🌐</span>
      </div>
    ),
    IndexedDB: (
      <div
        className={`bg-orange-500 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🗄️</span>
      </div>
    ),
    'SQL / NoSQL': (
      <svg
        width={size}
        height={size}
        fill="#000000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 548.29 548.291"
      >
        <title>SQL Logo</title>
        <path d="M276.043,244.216c-24.575,0-38.741,24.087-38.741,53.862c-0.241,30.228,14.407,53.382,38.5,53.382 c24.323,0,38.512-22.92,38.512-54.091C314.313,268.303,300.604,244.216,276.043,244.216z"></path>
        <path d="M486.2,196.116h-13.164V132.59c0-0.399-0.064-0.795-0.116-1.2c-0.021-2.52-0.824-4.997-2.551-6.96L364.656,3.677 c-0.031-0.031-0.064-0.044-0.085-0.075c-0.629-0.704-1.364-1.29-2.141-1.796c-0.231-0.154-0.462-0.283-0.704-0.419 c-0.672-0.365-1.386-0.672-2.121-0.893c-0.199-0.052-0.377-0.134-0.576-0.186C358.229,0.118,357.4,0,356.562,0H96.757 C84.893,0,75.256,9.649,75.256,21.502v174.613H62.093c-16.967,0-30.733,13.756-30.733,30.733v159.812 c0,16.961,13.766,30.731,30.733,30.731h13.163V526.79c0,11.854,9.637,21.501,21.501,21.501h354.777 c11.853,0,21.502-9.647,21.502-21.501V417.392H486.2c16.977,0,30.729-13.771,30.729-30.731V226.849 C516.93,209.872,503.177,196.116,486.2,196.116z M96.757,21.502h249.053v110.006c0,5.943,4.818,10.751,10.751,10.751h94.973 v53.861H96.757V21.502z M353.033,376.96l-10.394,27.884c-22.666-6.619-41.565-13.479-62.828-22.445 c-3.527-1.418-7.317-2.132-11.094-2.362c-35.909-2.352-69.449-28.819-69.449-80.778c0-47.711,30.236-83.623,77.71-83.623 c48.675,0,75.351,36.854,75.351,80.317c0,36.142-16.766,61.638-37.785,71.091v0.945 C326.828,371.528,340.519,374.367,353.033,376.96z M72.912,370.116l7.328-29.764c9.69,4.96,24.554,9.915,39.917,9.915 c16.525,0,25.271-6.84,25.271-17.228c0-9.928-7.56-15.597-26.691-22.442c-26.457-9.217-43.696-23.858-43.696-47.014 c0-27.163,22.68-47.948,60.231-47.948c17.954,0,31.184,3.791,40.623,8.03l-8.021,29.061c-6.375-3.076-17.711-7.564-33.3-7.564 c-15.599,0-23.163,7.079-23.163,15.357c0,10.15,8.977,14.646,29.533,22.447c28.108,10.394,41.332,25.023,41.332,47.464 c0,26.699-20.557,49.365-64.253,49.365C99.844,379.785,81.899,375.06,72.912,370.116z M451.534,520.962H96.757v-103.57h354.777 V520.962z M475.387,377.428h-99.455V218.231h36.158v128.97h63.297V377.428z"></path>
      </svg>
    ),
    'Web Security (OWASP)': (
      <div
        className={`bg-red-700 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🔒</span>
      </div>
    ),
    FrontOps: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <title>Yarn Logo</title>
        <g>
          <path
            d="M128,0 C57.3281853,0 0,57.3281853 0,128 C0,198.671815 57.3281853,256 128,256 C198.671815,256 256,198.671815 256,128 C256,57.3281853 198.671815,0 128,0"
            fill="#368FB9"
          />
          <path
            d="M203.317375,174.060232 C195.410039,175.938224 191.40695,177.667954 181.621622,184.043243 C166.350579,193.927413 149.646332,198.523552 149.646332,198.523552 C149.646332,198.523552 148.262548,200.599228 144.259459,201.538224 C137.340541,203.218533 111.295753,204.651737 108.923552,204.701158 C102.548263,204.750579 98.6440154,203.07027 97.5567568,200.450965 C94.2455598,192.543629 102.301158,189.08417 102.301158,189.08417 C102.301158,189.08417 100.522008,187.996911 99.4841699,187.008494 C98.5451737,186.069498 97.5567568,184.191506 97.2602317,184.883398 C96.0247104,187.898069 95.3822394,195.261776 92.0710425,198.572973 C87.5243243,203.169112 78.9250965,201.637066 73.834749,198.96834 C68.2501931,196.003089 74.2301158,189.034749 74.2301158,189.034749 C74.2301158,189.034749 71.215444,190.8139 68.7938224,187.156757 C66.619305,183.796139 64.5930502,178.06332 65.1366795,170.996139 C65.7297297,162.940541 74.7243243,155.132046 74.7243243,155.132046 C74.7243243,155.132046 73.1428571,143.221622 78.3320463,131.014672 C83.027027,119.894981 95.6787645,110.949807 95.6787645,110.949807 C95.6787645,110.949807 85.0532819,99.1876448 89.0069498,88.611583 C91.576834,81.6926641 92.6146718,81.7420849 93.4548263,81.4455598 C96.4200772,80.3088803 99.2864865,79.0733591 101.411583,76.7505792 C112.037066,65.2849421 125.578378,67.4594595 125.578378,67.4594595 C125.578378,67.4594595 132.003089,47.9382239 137.933591,51.7436293 C139.762162,52.9297297 146.335135,67.5583012 146.335135,67.5583012 C146.335135,67.5583012 153.352896,63.4563707 154.143629,64.988417 C158.393822,73.2416988 158.888031,89.0069498 157.010039,98.5945946 C153.847104,114.409266 145.939768,122.909653 142.776834,128.247104 C142.035521,129.482625 151.27722,133.386873 157.10888,149.54749 C162.495753,164.324324 157.701931,176.728958 158.542085,178.112741 C158.690347,178.359846 158.739768,178.458687 158.739768,178.458687 C158.739768,178.458687 164.917375,178.952896 177.322008,171.292664 C183.944402,167.190734 191.802317,162.594595 200.74749,162.495753 C209.396139,162.34749 209.840927,172.478764 203.317375,174.060232 L203.317375,174.060232 Z M215.079537,166.795367 C214.189961,159.777606 208.259459,154.934363 200.648649,155.033205 C189.281853,155.181467 179.743629,161.062548 173.417761,164.966795 C170.946718,166.498842 168.821622,167.635521 166.99305,168.475676 C167.388417,162.742857 167.042471,155.230888 164.07722,146.977606 C160.469498,137.093436 155.626255,131.014672 152.166795,127.505792 C156.169884,121.674131 161.655598,113.173745 164.225483,100.027799 C166.449421,88.8092664 165.757529,71.3637066 160.667181,61.5783784 C159.629344,59.6015444 157.899614,58.1683398 155.725097,57.5752896 C154.835521,57.3281853 153.155212,56.8339768 149.844015,57.772973 C144.85251,47.4440154 143.12278,46.3567568 141.788417,45.4671815 C139.020849,43.6880309 135.759073,43.2926641 132.694981,44.4293436 C128.59305,45.9119691 125.08417,49.8656371 121.772973,56.8833977 C121.278764,57.9212355 120.833977,58.9096525 120.43861,59.8980695 C114.162162,60.3428571 104.277992,62.6162162 95.9258687,71.6602317 C94.8880309,72.7969112 92.8617761,73.6370656 90.7366795,74.4277992 L90.7861004,74.4277992 C86.4370656,75.9598456 84.4602317,79.5181467 82.03861,85.9428571 C78.6779923,94.9374517 82.1374517,103.783784 85.5474903,109.516602 C80.9019305,113.667954 74.7243243,120.290347 71.4625483,128.049421 C67.4100386,137.637066 66.965251,147.027027 67.1135135,152.117375 C63.6540541,155.774517 58.3166023,162.644015 57.7235521,170.353668 C56.9328185,181.127413 60.8370656,188.441699 62.5667954,191.110425 C63.0610039,191.901158 63.6046332,192.543629 64.1976834,193.1861 C64,194.520463 63.9505792,195.953668 64.2471042,197.436293 C64.8895753,200.895753 67.0640927,203.712741 70.3752896,205.491892 C76.8988417,208.951351 85.992278,210.433977 93.0100386,206.925097 C95.5305019,209.593822 100.126641,212.163707 108.478764,212.163707 L108.972973,212.163707 C111.098069,212.163707 138.081853,210.730502 145.939768,208.803089 C149.448649,207.962934 151.87027,206.480309 153.451737,205.145946 C158.492664,203.564479 172.429344,198.820077 185.57529,190.319691 C194.866409,184.290347 198.078764,183.005405 204.997683,181.325097 C211.718919,179.694208 215.919691,173.566023 215.079537,166.795367 L215.079537,166.795367 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    ),
    'QA / Testing': (
      <div
        className={`bg-green-700 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🧪</span>
      </div>
    ),
    'Automated Testing': (
      <div
        className={`bg-emerald-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🤖</span>
      </div>
    ),
    'Headless CMS': (
      <div
        className={`bg-violet-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">📝</span>
      </div>
    ),
    SEO: (
      <div
        className={`bg-yellow-600 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">🔍</span>
      </div>
    ),
    // Default fallback
    default: (
      <div
        className={`bg-gray-400 rounded flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">⚡</span>
      </div>
    ),
  };

  return techIcons[name] || techIcons['default'];
}
