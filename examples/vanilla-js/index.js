import {
  generateQRCode,
  checkPlutoExtensionInstalled,
  redirectToPlutoExtensionPage,
} from "@plutoxyz/web-proofs";

const init = async () => {
  const manifestUrl =
    "https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json";
  const sessionId = `${Date.now()}`;

  /**
   * We have to do a few things.
   * Step 1: Check if they have the Pluto Chrome extension, and if they don't, offer to install it.
   * Step 2: Give them the option to scan a QR code to install and use the mobile app instead
   */

  if (!checkPlutoExtensionInstalled()) {
    document.querySelector("#installChromeExtension").onclick = () => {
      redirectToPlutoExtensionPage();
    };
    document.querySelector("#installChromeExtension").style.display = "block";
  } else {
    document.querySelector("#proveThroughExtension").onclick = async () => {
      const proof = await window.pluto.prove(manifestUrl);
      console.log(proof);
    };
    document.querySelector("#proveThroughExtension").style.display = "block";
  }

  const qrCode = await generateQRCode({
    manifestUrl: manifestUrl,
    sessionId: sessionId,
  });

  const img = document.createElement("img");
  img.src = qrCode;

  document.body.appendChild(img);
};

window.addEventListener("load", init);
