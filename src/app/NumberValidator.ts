export class NumberValidator
{
  constructor()
  {
    // empty
  }

  // check a general number that may be positive or negative for validity while typing
  public static validate(evt: any): boolean
  {
    const value: number = evt.target.value;

    if (isNaN(value) || value.toString() == '')
    {
      evt.target.value = "";

      // do not allow the input
      evt.preventDefault();
      return false;
    }
    else
    {
      // value is okay
      return true
    }
  }
}
